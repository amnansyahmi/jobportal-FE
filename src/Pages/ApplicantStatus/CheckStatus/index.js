import React, {Component} from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, CardHeader, Button, Input, FormGroup  } from 'reactstrap';
import agent from 'agent'
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { Link } from 'react-router-dom'
import swal from 'sweetalert';
// import searchIcon  from 'assets/theme/logoicon/search.png'
// import existingIcon  from 'assets/theme/logoicon/exist.png'
// import temporaryIcon  from 'assets/theme/logoicon/temporary.png'
// import customStyles from 'Admin/componentStyle/datatable/CustomStyleMain';

export default class CheckStatus extends Component {

constructor(props) {
        super(props);

        this.state = {
            data: [],
            data2: [],
            showing: false,
        };

        this.onSearchValue = this.onSearchValue.bind(this);

    }

    onSearchValue() {

        if(document.getElementById('searchValue').value !== ''){
            agent.GetApplicantDetails.get(document.getElementById('searchValue').value).then(result => {
            // Update react-table
                this.setState({
                    data: result.data,
                    data2: result.data,
                    showing: true
                });
            });
        }else{
            swal({
                title: 'Invalid Input',
                icon: 'error',
                button: 'Close',
            })
        }
    }

  render() {

    const columns = [
    {
      name: '#',
      sortable: true,
      cell: (row, index) => index + 1,
      width: '5%'
    },
    {
      name: 'First Name',
      selector: row => row['FirstName'],
      sortable: true,
      wrap: true,
      width: '16%'
    },
    {
      name: 'Last Name',
      selector: row => row['LastName'],
      sortable: true,
      wrap: true,
      width: '16%'
    },
    {
      name: 'Date Applied',
      selector: row => moment(row['CreatedDt']).format('DD/MM/YYYY'),
      sortable: true,
      wrap: true,
      width: '15%'
    },
    {
      name: 'Job Applied',
      selector: row => row['JobTitle'],
      sortable: true,
      wrap: true,
      width: '30%'
    },
    {
        name: 'Status',
        sortable: true,
        wrap: true,
        width: '18%',
        cell: row => {
            return (<div>Pending</div>);
        }
    },
];

    return (
            <div className="mw-100">
              <Row>
                <div className="w-100">
                    <center>
                    <Row className="bg-main-color border-0 p-1" center={true}>
                        <Col>
                            <Input type="text" name="searchValue" id="searchValue" placeholder="Search by Email Address"/>
                        </Col>
                    </Row></center>
                    <Row className="bg-main-color border-0 p-1">
                        <Col >
                            <Button onClick={this.onSearchValue}>Search</Button>
                        </Col>
                    </Row>
                      {/* <input type="text" className="ml-2 search-form" color="white" onChange={this.onSearchValue} id="searchValue" placeholder="Search by Job Title"></input> */}
                </div>
                <br/>
                {this.state.showing == true ?
                    <div className="m-0 w-100">
                        <br/>
                        <DataTable
                        columns={columns}
                        data={this.state.data}
                        noHeader={true}
                        //   customStyles={customStyles}
                        pagination
                        paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                        />
                    </div>
                :
                    null
                }
                
                </Row>
            </div>
    )
  }
};

