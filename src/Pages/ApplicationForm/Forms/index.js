import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import agent from 'agent';
import {
    Col, Card, CardBody,
    CardTitle, Button, Form, FormGroup, Label, Input, FormText
} from 'reactstrap';
import { DropzoneArea } from 'material-ui-dropzone';

export default class Forms extends React.Component {
    constructor(props) {
        super(props);

        this.onDrop = (files) => {
            this.setState({files})
        };
    }

    onDrop(files) {
        console.log('fileslagi',files);
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({isLoading: true});
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const jobTitle = document.getElementById('jobTitle').value;
        const yearsExp = document.getElementById('yearsExp').value;
        const prefLocation = document.getElementById('prefLocation').value;
        const vacancyFoundIn = document.getElementById('vacancyFoundIn').value;
        const noticePeriod = document.getElementById('noticePeriod').value;
        const contactNo = document.getElementById('contactNo').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;

        agent.AddApplicant.post(firstName, lastName, jobTitle, yearsExp, prefLocation, vacancyFoundIn, noticePeriod, contactNo, address, email)
            .then(result => {
                if (result.data.status) {
                    this.setState({redirect: true, isLoading: false});
                }
                else
                {
                    // swal({prefLocation
                    //     title: result.data.errorMsg,
                    //     icon: 'error',
                    //     button: 'Close',
                    // })
                    this.setState({isLoading: false});
                }
                window.location.reload();
            })
            .catch(error => {
                // swal({
                //     title: error.message,
                //     icon: 'error',
                //     button: 'Close',
                // })
                this.setState({isLoading: false});
            });
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
                            <CardTitle>Application Form</CardTitle>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup row>
                                    <Label for="firstName" sm={3}>First Name</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="firstName" id="firstName"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="lastName" sm={3}>Last Name</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="lastName" id="lastName"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="jobTitle" sm={3}>Job Title</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="jobTitle" id="jobTitle"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="yearsExp" sm={3}>Number Of Years' Experience</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="yearsExp" id="yearsExp"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="prefLocation" sm={3}>Preferred Location</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="prefLocation" id="prefLocation"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="vacancyFoundIn" sm={3}>Where Did You Hear About The Vacancy</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="vacancyFoundIn" id="vacancyFoundIn"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="noticePeriod" sm={3}>Notice Period In Your Current Role</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="noticePeriod" id="noticePeriod"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="contactNo" sm={3}>Contact No.</Label>
                                    <Col sm={9}>
                                        <Input type="text" name="contactNo" id="contactNo"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="email" sm={3}>Email</Label>
                                    <Col sm={9}>
                                        <Input type="email" name="email" id="email"
                                               placeholder="with a placeholder"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="address" sm={3}>Address</Label>
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
                                            maxFileSize={10000}
                                            onDrop={this.onDrop.bind(this)}
                                            showPreviewsInDropzone={false}
                                            showAlerts={false}
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
                                {/* <FormGroup row>
                                    <Label for="exampleSelect" sm={2}>Select</Label>
                                    <Col sm={10}>
                                        <Input type="select" name="select" id="exampleSelect"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="exampleSelectMulti" sm={2}>Select Multiple</Label>
                                    <Col sm={10}>
                                        <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="exampleText" sm={2}>Text Area</Label>
                                    <Col sm={10}>
                                        <Input type="textarea" name="text" id="exampleText"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="exampleFile" sm={2}>File</Label>
                                    <Col sm={10}>
                                        <Input type="file" name="file" id="exampleFile"/>
                                        <FormText color="muted">
                                            This is some placeholder block-level help text for the above input.
                                            It's a bit lighter and easily wraps to a new line.
                                        </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup tag="fieldset" row>
                                    <legend className="col-form-label col-sm-2">Radio Buttons</legend>
                                    <Col sm={10}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="radio" name="radio2"/>{' '}
                                                Option one is this and that—be sure to include why it's great
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="radio" name="radio2"/>{' '}
                                                Option two can be something else and selecting it will deselect option
                                                one
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check disabled>
                                            <Label check>
                                                <Input type="radio" name="radio2" disabled/>{' '}
                                                Option three is disabled
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="checkbox2" sm={2}>Checkbox</Label>
                                    <Col sm={{size: 10}}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" id="checkbox2"/>{' '}
                                                Check me out
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup> */}
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
