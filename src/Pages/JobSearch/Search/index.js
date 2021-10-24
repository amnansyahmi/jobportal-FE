import React, {Component} from 'react';
import DataTable from 'react-data-table-component';
import { Row, CardHeader } from 'reactstrap';
import agent from 'agent'
import { Redirect } from 'react-router-dom';
import moment from 'moment';
// import searchIcon  from 'assets/theme/logoicon/search.png'
// import existingIcon  from 'assets/theme/logoicon/exist.png'
// import temporaryIcon  from 'assets/theme/logoicon/temporary.png'
// import customStyles from 'Admin/componentStyle/datatable/CustomStyleMain';

class Search extends Component {

constructor(props) {
        super(props);

        this.toggletab = this.toggletab.bind(this);

        this.state = {
            activeTab: '1',
            modal: false,
            modal2: false,
            data: [],
            data2: [],
            data3: [],
            filter: '',
            showing: false,
        };

        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggle2(codeSeq,userID,userType) {
        this.setState({
            modal2: !this.state.modal2,
            codeSeq: codeSeq,
            userID: userID,
            userType: userType
        });
        //console.log('userType',this.state.userType)
    }

    toggletab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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
            <div dangerouslySetInnerHTML={{ __html: row.data.JobDescription }} />
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
                data3: result.data,
                loading: true
            });
        });
        //console.log('userType',this.state.data.AUDIT_USER_TYPE);

    }

  render() {

    const columns = [
    {
        name: '#',
        sortable: true,
        cell: (row, index) => index + 1,
        width: '20px'
    },
    {
      name: 'Job Title',
      selector: row => row['JobTitle'],
      sortable: true,
      wrap: true,
    },
    {
        name: 'Salary Range',
        selector: row => row['SalaryRange'],
        sortable: true,
        wrap: true,
      },
    {
        name: 'Posted Date',
        selector: row => moment(row['PostedDt']).format('DD/MM/YYYY'),
        sortable: true,
        wrap: true,
    },
];

    return (
            <div className="mw-100">
              <Row>
                <div className="w-100">
                  <CardHeader className="bg-main-color border-0 p-1 w-100">
                    <div className="input-group">
                      <span className="ml-2 span">
                        {/* <img alt="" src={searchIcon} aria-hidden="true"></img> */}
                      </span>
                      <input type="text" className="ml-2 search-form" color="white" onChange={this.onSearchValue} id="searchValue" placeholder="Search by field value"></input>
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

export default Search;
