import React, {Component} from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, CardHeader, Button  } from 'reactstrap';
import agent from 'agent'
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import applicationForm from '../../ApplicationForm/Forms'
import { Link } from 'react-router-dom'
// import searchIcon  from 'assets/theme/logoicon/search.png'
// import existingIcon  from 'assets/theme/logoicon/exist.png'
// import temporaryIcon  from 'assets/theme/logoicon/temporary.png'
// import customStyles from 'Admin/componentStyle/datatable/CustomStyleMain';

export default class Search extends Component {

constructor(props) {
        super(props);

        this.state = {
            data: [],
            data2: [],
            showing: false,
        };
    }

    onSearchValue = () => {
      this.setState({
        data:this.state.data2.filter(data => 
          data.JobTitle.toLowerCase().includes(document.getElementById('searchValue').value.toLowerCase())
        )
      });
    }

    ExpandedComponent = (row) => {
        return (
            <div>
            <Row  style={{padding: '35px'}}>
                <Col>
                    <Row><b>Job Description</b></Row>
                    <br/>
                    <Row style={{textAlign:'justify'}}><div dangerouslySetInnerHTML={{ __html: row.data.JobDescription }} /></Row>
                    <br/>
                    <Row><Col className="text-center text-md-right">
                        <Link to={{pathname: "/ApplicationForm/Forms", JobID: row.data.JobID, JobTitle: row.data.JobTitle, JobType: row.data.JobType }}><Button color="primary" className="mr-1">Apply</Button></Link>
                        {/* <Link to={applicationForm} className="btn btn-primary">Apply</Link> */}
                        {/* </Link> */}
                    </Col></Row>
                </Col>
            </Row>
            </div>
        )
            
    }

    renderRedirect = () => {
      if (this.state.redirect) {
          return <Redirect to='/history/history-table'/>
      }
    };

    componentDidMount()
    {
        agent.GetJobList.get().then(result => {
        // Update react-table
            this.setState({
                data: result.data,
                data2: result.data,
                loading: true
            });
        });

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
      name: 'Job Title',
      selector: row => row['JobTitle'],
      sortable: true,
      wrap: true,
      width: '29%'
    },
    {
      name: 'Salary Range',
      selector: row => row['SalaryRange'],
      sortable: true,
      wrap: true,
      center: true,
      width: '16%'
    },
    {
      name: 'Posted Date',
      selector: row => moment(row['PostedDt']).format('DD/MM/YYYY'),
      sortable: true,
      center: true,
      wrap: true,
      width: '14%'
    },
    {
      name: 'Closing Date',
      selector: row => moment(row['ClosingDt']).format('DD/MM/YYYY'),
      sortable: true,
      center: true,
      wrap: true,
      width: '14%'
    },
    {
      name: 'Submitted Application',
      selector: row => row['SubmittedApplication'],
      sortable: true,
      center: true,
      wrap: true,
      width: '18%'
    },
];

    return (
            <div className="mw-100">
              <Row>
                <div className="w-100">
                  <CardHeader className="bg-main-color border-0 p-1 w-100">
                    <div className="input-group">
                      <input type="text" className="ml-2 search-form" color="white" onChange={this.onSearchValue} id="searchValue" placeholder="Search by Job Title"></input>
                    </div>
                  </CardHeader>
                </div>
                    <div className="m-0 w-100">
                    <DataTable
                      columns={columns}
                      data={this.state.data}
                      noHeader={true}
                      expandableRows expandableRowsComponent={this.ExpandedComponent}
                    //   customStyles={customStyles}
                      pagination
                      paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                    />
                  </div>
                </Row>
            </div>
    )
  }
};

