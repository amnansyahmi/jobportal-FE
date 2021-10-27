import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import agent from 'agent';
import {
    Col, Card, CardBody, Row,
    CardTitle, Button, Form, FormGroup, Label, Input
} from 'reactstrap';
import { DropzoneArea } from 'material-ui-dropzone';
import Select from "react-dropdown-select";
import styled from "@emotion/styled";
import swal from 'sweetalert';

const StyledSelect = styled(Select)`
  ${({ dropdownRenderer }) =>
    dropdownRenderer &&
    `
    .react-dropdown-select-dropdown {
      overflow: initial;
    }
  `}
`;

export default class Forms extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobListOption: [],
            contactNo: '',
            noticePeriod: '',
            yearsExp: '',
            jobTitle: this.props.location.JobTitle,
            JobID: this.props.location.JobID,
            JobType: this.props.location.JobType,
            regexp : /^[0-9\b]+$/,
            vacancyFoundInList: [],
            cSelected: [],
            skillData: [],
            skillData2: [],
            showing: false
        }
        this.onDrop = (files) => {
            this.setState({files})
        };

        

        this.onHandleNumberInputChange = this.onHandleNumberInputChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    }

    handleFile(files) {
  
        files.map(file => {
          const reader = new FileReader();
          reader.onload = (event) => {
  
            const fileName = file.path.substr(0, file.path.indexOf('.'));
            const filePath = file.path;
            const fileEncode = event.target.result;

            this.setState({
                fileName: fileName,
                filePath: filePath,
                fileEncode: fileEncode
            })
          };
          reader.readAsDataURL(file);
      });
    }
    
    onDrop(files) {
        const _this = this;
        if (this.state.fileObjects.length + files.length > this.props.filesLimit) {
            this.setState({
                openSnackBar: true,
                snackbarMessage: this.props.getFileLimitExceedMessage(this.props.filesLimit),
                snackbarVariant: 'error'
            });
        } else {
            var count = 0;
            var message = '';
            files.map(s => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    _this.setState({
                        fileObjects: _this.state.fileObjects.concat({ file: s.file, data: event.target.result })
                    }, () => {
                        if (this.props.onChange) {
                            this.props.onChange(_this.state.fileObjects.map(fileObject => fileObject.file));
                        }
                        if (this.props.onDrop) {
                            this.props.onDrop(s.file)
                        }
                        message += this.props.getFileAddedMessage(s.file.name);
                        count++; // we cannot rely on the index because this is asynchronous
                        if (count === files.length) {
                            // display message when the last one fires
                            this.setState({
                                openSnackBar: true,
                                snackbarMessage: message,
                                snackbarVariant: 'success'
                            });
                        }
                    });
                };
                reader.readAsDataURL(s.file);
            })
        }
    }

    onHandleNumberInputChange = e => {
        let contactNo = e.target.value;

        // if value is not blank, then test the regex
        if (contactNo === '' || this.state.regexp.test(contactNo)) {
            this.setState({ [e.target.name]: contactNo })
        }
    };

    componentDidMount()
    {
        agent.GetSkills.get().then(result => {
            this.setState({
                skillData: result.data,
                skillData2: result.data
            });
        });

        if (typeof this.state.JobID != 'undefined')
        {  
            this.setState({
                searchJobID: this.state.JobID,
                showing: true,
                // skillData: this.state.skillData2.filter(s => s.JobType == this.state.JobType),
            })
        }else{
            this.setState({
                searchJobID: ''
            })
        }

        agent.GetJobList.get().then(result => {
            this.setState({
                data: result.data,
                data2: result.data,
            });
            const jobListOption = result.data.map( d => ({
              "value" : d.JobID,
              "label" : d.JobTitle,
              "type" : d.JobType,
            }))
            this.setState({jobListOption: jobListOption})
        });

        agent.GetCodeConfig.get(101).then(result => {
            this.setState({vacancyFoundInList: result.data.filter(s => s.CodeStatus == 1)})
        })

        
    }

    setJobListValues = (ddJobList, jobType) => {
        // console.log(this.state.skillData2.filter(s => s.JobType == jobType));
        this.setState({ 
            ddJobList: ddJobList,
            skillData: this.state.skillData2.filter(s => s.JobType == jobType),
            showing: true
        })

    };

    onCheckboxBtnClick(selected) {
        
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
            this.state.cSelected.push(selected);
        } else {
            this.state.cSelected.splice(index, 1);
        }
        this.setState({cSelected: [...this.state.cSelected]});
    }


    handleSubmit = (event) => {

        event.preventDefault();
        this.setState({isLoading: true});
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        let jobId = "";

        if(typeof  this.state.fileEncode == 'undefined')
        {
            swal({
                title: 'Please Attach Your Resume. Thank You',
                icon: 'warning',
                button: 'Close',
            })
        }else{

        if(this.state.searchJobID !== '')
        {
            jobId = this.state.searchJobID;
        }else{
            jobId = this.state.ddJobList;
        }

        var radios = document.getElementsByName('VacancyFoundIn');
        
        let checkedVacancyFoundIn = "";
        for (var i = 0, length = radios.length; i < length; i++) 
        {
            if (radios[i].checked) {
                this.setState({
                    vacancyFoundIn: radios[i].value
                })
                checkedVacancyFoundIn = radios[i].value;
            }
        }

        const yearsExp = document.getElementById('yearsExp').value;
        const prefLocation = document.getElementById('prefLocation').value;
        // const vacancyFoundIn = document.getElementById('vacancyFoundIn').value;
        const vacancyFoundIn = checkedVacancyFoundIn;
        const noticePeriod = document.getElementById('noticePeriod').value;
        const contactNo = this.state.contactNo;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const fileName = this.state.fileName;
        const filePath = this.state.filePath; 
        const fileEncode = this.state.fileEncode;
        const skills = this.state.cSelected;
        agent.AddApplicant.post(firstName, lastName, jobId, yearsExp, prefLocation, vacancyFoundIn, noticePeriod, contactNo, address, email, fileName, filePath, fileEncode, skills)
            .then(result => {
                if (result.data.status) {
                    this.setState({redirect: true, isLoading: false});
                    swal({
                        title: 'Thank you. Your form has been submitted successfully.',
                        icon: 'success',
                        button: 'Close',
                      }).then(() => {window.location.reload();})
                }
                else
                {
                    swal({
                        title: result.data.errorMsg,
                        icon: 'error',
                        button: 'Close',
                    })
                    this.setState({isLoading: false});
                }
                
            })
            .catch(error => {
                // swal({
                //     title: error.message,
                //     icon: 'error',
                //     button: 'Close',
                // })
                this.setState({isLoading: false});
            });
        }
    };

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Card className="main-card mb-3">
                        <CardBody>
                            <CardTitle>Job Application Form</CardTitle>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup row>
                                    <Label for="firstName" sm={3}>First Name *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="firstName" id="firstName" required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="lastName" sm={3}>Last Name *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="lastName" id="lastName" required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="jobTitle" sm={3}>Job Title *</Label>
                                    <Col sm={9}>
                                        {this.state.searchJobID  !== '' ?
                                            <Input type="text" name="jobTitle" id="jobTitle" value={this.props.location.JobTitle} disabled/>
                                        :
                                            <StyledSelect
                                                separator={true}                                   
                                                className="ddstyle"
                                                clearable={true}
                                                required={true}
                                                // labelField={this.state.labelField}
                                                // valueField={this.state.valueField}
                                                options={this.state.jobListOption}
                                                dropdownGap={5}
                                                onChange={values => this.setJobListValues(values.map(item => item.value),values.map(item => item.type))}
                                                noDataLabel="No matches found"
                                            />
                                        }
                                    
                                    {/* <Col sm={9}>
                                        <Input type="text" name="jobTitle" id="jobTitle"/> */}
                                    </Col>
                                </FormGroup>
                                {this.state.showing === true ? 
                                    <FormGroup row>
                                        <Label for="jobTitle" sm={3}>Skills</Label>
                                        <Col sm={9}>
                                        {this.state.searchJobID  !== '' ?
                                           this.state.skillData.filter(s => s.JobType == this.state.JobType).map(row => 
                                            {
                                                return(<Row  style={{paddingLeft: '25px'}} form><Input type="checkbox" id={row.SkillID} onClick={() => this.onCheckboxBtnClick(row.SkillID)} />{row.SkillDesc}</Row>)
                                            })
                                        :
                                            this.state.skillData.map(row => 
                                            {
                                                return(<Row  style={{paddingLeft: '25px'}} form><Input type="checkbox" id={row.SkillID} onClick={() => this.onCheckboxBtnClick(row.SkillID)} />{row.SkillDesc}</Row>)
                                            })
                                        }
                                        </Col>
                                    </FormGroup>
                                :
                                    null    
                                }
                                <FormGroup row>
                                    <Label for="yearsExp" sm={3}>Number Of Years' Experience *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="yearsExp" id="yearsExp" required value={this.state.yearsExp}  onChange={this.onHandleNumberInputChange}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="prefLocation" sm={3}>Preferred Location *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="prefLocation" id="prefLocation" required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="vacancyFoundIn" sm={3}>Where Did You Hear About The Vacancy *</Label>
                                    <Col sm={9}>
                                        <FormGroup check onChange={this.check}>
                                        {this.state.vacancyFoundInList.map(row => 
                                        {
                                            return(<Row form><Input type="radio" required id={row.CodeDescription} value={row.SubCode} name={row.CodeCategory}/>{row.CodeDescription}</Row>)
                                        })
                                        }
                                        </FormGroup>
                                        {/* <Input type="text" name="vacancyFoundIn" id="vacancyFoundIn" required/> */}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="noticePeriod" sm={3}>Notice Period In Your Current Role (in Months) *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="noticePeriod" id="noticePeriod" required value={this.state.noticePeriod} onChange={this.onHandleNumberInputChange}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="contactNo" sm={3}>Contact No. *</Label>
                                    <Col sm={9}>
                                        <Input type="tel" name="contactNo" id="contactNo" placeholder = "Contact No." value={this.state.contactNo} onChange={this.onHandleNumberInputChange} required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="email" sm={3}>Email *</Label>
                                    <Col sm={9}>
                                        <Input type="email" name="email" id="email" placeholder="example@example.com" required />
                                        {/* <Input type="email" name="email" id="email" placeholder="example@example.com" pattern="/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g" required oninvalid="this.setCustomValidity('Invalid Email Format')"/> */}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="address" sm={3}>Address *</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="address" id="address"/>
                                    </Col>
                                </FormGroup>
                                {/* <FormGroup row>
                                    <Label for="examplePassword" sm={2}>Password</Label>
                                    <Col sm={10}>
                                        <Input type="password" name="password" id="examplePassword"
                                               placeholder="password placeholder"/>
                                    </Col>
                                </FormGroup> */}
                                <FormGroup row>
                                    <Label for="attachment" sm={3}>Attachments</Label>
                                    <Col sm={9}>
                                        Please Attach your resume here
                                        <DropzoneArea
                                            cancelButtonText={"Cancel"}
                                            submitButtonText={"Submit"}
                                            maxFileSize={1000000}
                                            filesLimit={1}
                                            onDrop={this.onDrop.bind(this)}
                                            showPreviewsInDropzone={false}
                                            showAlerts={false}
                                            onChange={this.handleFile}
                                            // open={this.state.open}
                                            // onClose={() => this.setState({open: !this.state.open})}
                                            onSave={this.handleFile}
                                            showPreviews={true}
                                            showFileNamesInPreview={true}
                                            useChipsForPreview
                                            previewText="Attached files"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup check row>
                                    <Col className="text-center text-md-right" sm={{size: 10, offset: 2}}>
                                        <Button>Submit</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
