import React from 'react';
import { Row, Col, Card, CardHeader, Button, CardBody, Alert, Badge, Modal, ModalBody, ModalFooter, ModalHeader, Container } from 'reactstrap';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { dateFormatter } from '../../components/helper/func';
import { fetchRoleByFilter } from '../../api/Role';
import { SearchBox } from '../../components/SearchBox/SearchBox';
import { Pagination } from '../../components/Pagination/Pagination';
import { deleteRole } from '../../api/Role';
import PageTitle from '../../components/common/PageTitle';

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      currentPage: 1,
      totalPage: 0,
      rowPerPage: 10,
      totalRecord: 0,
      searchKeyword: "",
      feature: {},
      //Display All of Data  
      deleteModal: false, // close Or open delete box of selected item
      //Delete Item
      errorMessage: "",
      successMessage: "",
      //if CURD is completed clear message of it completed process
    }
  }

  //Display All of Data
  componentDidMount() {
    this.loadData();
  }

  //Display All of Data
  async loadData(isContinueFetch = false) {
    this.setState({ isLoading: true });
    const { currentPage, rowPerPage, searchKeyword } = this.state;
    const res = await fetchRoleByFilter(currentPage, rowPerPage, searchKeyword);
    console.log("RoleList");
    console.log(res);
    this.setState({
      data: res.records,
      totalRecord: res.totalRecord,
      totalPage: Math.ceil(res.totalRecord / rowPerPage)
    }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));
  }

  //Display All of Data
  async loadOptions() { }

  //Display All of Data
  renderRoleListTable = () => {
    let { feature, data } = this.state;
    if (data.length <= 0) return <b>No Data To Show</b>;
    return (
      <div className="table-responsive">
        <table className="table table-bordered  table-striped table-hover">
          <thead>
            <tr>
              <th>Status</th>
              <th>Role Name</th>
              <th>Updated Date</th>
              <th>Update By</th>
              {feature.editPerm !== 0 || feature.deletePerm !== 0 ?
                <th>Action</th> : ""
              }
            </tr>
          </thead>
          <tbody>
          {/* {console.log("role data")};
                        {console.log(data)}; */}
            {data.map((item, idx) =>
              <tr key={idx}>
                <td>
                  {
                    item.recordStatus === "Active" ?
                      <Badge color="success">Active</Badge> :
                      <Badge color="secondary">Inactive</Badge>
                  }
                </td>
                <td>{item.roleName}</td>
                <td>
                  <span>{dateFormatter(item.updatedDate == null ? item.createdDate : item.updatedDate)}</span>
                </td>
                <td>
                  <span>{item.updatedBy == null ? item.createdBy : item.updatedBy}</span>
                </td>
                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                  <td></td> :
                  <>
                    <td>
                      <span>
                        <Button color="primary" onClick={() => this.handleEdit(item.roleKey)} > <i className="fa fa-edit"></i></Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                      </span>
                    </td>
                  </>
                }

                {/* deleteModel(1) === idx(1) => open delete modal box
                deleteModel(-1) === idx(1) => close delete modal box */}
                {/* Delete Item */}
                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                  <ModalHeader toggle={() => this.toggle(idx)}>Delete Role Name</ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete "{item.roleName}"?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                    <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                  </ModalFooter>
                </Modal>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  //SearchBox
  handleSearch(searchKeyword, wait) {
    this.setState({ searchKeyword }, () => {
      wait ? this.debounceSearching(searchKeyword, 1000) : this.searchByFilter();
    });
  }

  //SearchBox
  debounceSearching(searchKeyword, time) {
    window.clearInterval(this.setTimeInterval);
    let count = 0;
    this.setTimeInterval = window.setInterval(() => {
      count++;
      if (count === 10) {
        window.clearInterval(this.setTimeInterval);
        this.searchByFilter();
      }
    }, Math.floor(time / 10));
  }

  //SearchBox
  searchByFilter() {
    this.setState({ currentPage: 1 }, () => this.loadData());
  }

  //Pagination  onClickPageNumber button
  onClickPageNumber(e, index) {
    e.preventDefault();
    this.setState({ currentPage: index }, () => this.loadData());
  }

  //Pagination  onClickRowPerPage select
  onClickRowPerPage(e) {
    this.setState({
      currentPage: 1,
      //
      rowPerPage: Number(e.target.value),
      // 12 / 100 = 0.12 -> 1
      totalPage: Math.ceil(this.state.data.length / Number(e.target.value)),
    }, () => this.loadData());
  }

  // close Or open delete box of selected item
  toggle(index) {
    // console.log(index);
    const { deleteModal } = this.state;
    // console.log(deleteModal);
    //1st time
    //false === 1 ? -1 : 1
    //2st time
    //1 === 1 ? -1 : 1
    //3 th time
    //1 === 1 ? -1 : 1
    this.setState({ deleteModal: deleteModal === index ? -1 : index });
  }

  //Delete Selected Item from RoleList
  async handleDelete(rowObj) {
    // console.log(rowObj);
    this.setState({ isLoading: true });
    this.clearMessages();
    var res = await deleteRole(rowObj);
    if (res) {
      this.loadData();
      this.setState({ successMessage: "Delete " + rowObj.roleName + " Successful.", deleteModal: -1, isLoading: false });
    } else {
      this.setState({ errorMessage: res.message, deleteModal: -1, isLoading: false });
    }
  }

  //if CURD is completed clear message of it completed process
  clearMessages() {
    this.setState({
      errorMessage: "",
      successMessage: ""
    });
  }

  //Go to AddRole.js
  New() {
    //"history" from Route in App.js
    this.props.history.push({ pathname: "/newrole" });
  }

  //Go to EditRole.js
  handleEdit(roleKey){
    console.log(`key ${roleKey}`);
    this.props.history.push({ pathname: `/editrole/${roleKey}` });
  }

  render() {
    const { totalPage, currentPage, rowPerPage, totalRecord, searchKeyword, feature, isLoading } = this.state;
    return (
      <>
        {isLoading && <LoadingSpinner />}
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title="Role List" subtitle="CBM MIS" className="text-sm-left" />
          </Row>
          <Row >
            {this.state.isLoading && <LoadingSpinner />}
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <Button color="primary" className="float-right" onClick={() => this.New()}>New Role</Button>
                </CardHeader>
                <CardBody>
                  {this.state.errorMessage !== "" &&
                    <Alert theme="danger">{this.state.errorMessage}</Alert>
                  }
                  {this.state.successMessage !== "" &&
                    <Alert theme="success">{this.state.successMessage}</Alert>
                  }
                  <SearchBox value={searchKeyword} onSearchKeywordChange={(searchKeyword, wait) => this.handleSearch(searchKeyword, wait)} />
                  <br />
                  {this.renderRoleListTable()}
                  <Pagination
                    className=""
                    totalPage={totalPage} //2
                    currentPage={currentPage} //1
                    rowPerPage={rowPerPage} //10
                    totalRecord={totalRecord} //12
                    besideRangeDisplayed={2}
                    onClickPageNumber={(e, index) => this.onClickPageNumber(e, index)}
                    onClickRowPerPage={(e) => this.onClickRowPerPage(e)}
                  />
                </CardBody>
              </Card>
            </Col>

          </Row>
        </Container>
      </>
    );
  }

}
export default RoleList;

