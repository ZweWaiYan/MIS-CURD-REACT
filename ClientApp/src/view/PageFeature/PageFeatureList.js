import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button, Form, Input, FormGroup, Alert, Container, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PageTitle from '../../components/common/PageTitle';
import { deletePageFeature, fetchDuplicatePageFeature, SelectById } from "../../api/PageFeature";
import { savePageFeature } from "../../api/PageFeature";
import { EditPageFeature } from "../../api/PageFeature";

class PageFeatureList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,

      rowKey: "",

      currentPage: 1,
      totalPage: 0,
      rowPerPage: 10,
      totalRecord: 0,

      feature: {},
      deleteModal: false,

      editURL: "",
      editPageFeatureID: "",
      editFeatureID: "",

      SaveURL: "",
      SavePageFeatureID: "",
      SaveFeatureID: this.props.location.state.featureID,

      errors: [],
      successMessage: '',
      messageVisible: false,
    }
  }

  async componentDidMount() {
    // console.log("this.props.location.state.featureID");
    // console.log(this.props.location.state.featureID);
    console.log("this.props");
    console.log(this.props);
    const pageFeatureID = this.props.location.state.featureID;
    if (pageFeatureID) {
      this.setState({
        pageFeatureID,
      }, () => this.loadData())
    }
  }

  async loadData(isContinueFetch = false) {
    // console.log("this.state.pageFeatureID");
    // console.log(this.state.pageFeatureID);
    this.setState({ isLoading: true });
    console.log(this.state)
    const { currentPage, rowPerPage, pageFeatureID } = this.state
    // console.log("currentPage , rowPerPage , pageFeatureID");
    // console.log(currentPage , rowPerPage , pageFeatureID);
    const res = await SelectById(currentPage, rowPerPage, pageFeatureID);
    // console.log("res");
    // console.log(res);
    this.setState({
      data: res.pageFeatureRecords,
      totalRecord: res.pageFeatureTotalRecord,
      totalPage: Math.ceil(res.totalRecord / rowPerPage)
    }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));

  }

  clearMessages() {
    this.setState({
      errors: [],
      successMessage: "",
    });
  }

  cancelHandle() { this.props.history.push({ pathname: "/feature" }) }

  toggle(index) {
    const { deleteModal } = this.state;
    this.setState({ deleteModal: deleteModal === index ? -1 : index });
  }

  async handleDelete(rowObj) {
    console.log(rowObj);
    this.setState({ isLoading: true });
    this.clearMessages();
    var res = await deletePageFeature(rowObj);
    if (res) {
      
      this.setState({ successMessage: "Delete " + `"${rowObj.pageURL}"`+ " Successful.", deleteModal: -1, isLoading: false  , messageVisible: true});
      this.loadData();
    } else {
      this.setState({ errorMessage: res.message, deleteModal: -1, isLoading: false });
    }
  }


  handleEdit(data) {
    // console.log(data);
    this.setState({ editURL: data.pageURL, editPageFeatureID: data.pageFeatureID, editFeatureID: data.featureID, });
  }

  updateState(prop, value) {
    this.setState({ [prop]: value });
  }

  async handleSaveBtn() {
    // console.log("save clicked")
    // console.log(this.state.SaveURL)
    this.clearMessages();
    this.setState({ isLoading: true });
    var count = await fetchDuplicatePageFeature(this.state.SaveURL);
    // console.log("count")
    // console.log(count)
    if (this.validateSave() === false) return;
    if (count !== 0) {
      this.setState({
        messageVisible: true,
        errors: ["* This URL is already exist."]
      })
      return;
    } else {
      console.log("this.state");
      console.log(this.state);
      var res = await savePageFeature(this.state);
      console.log("res");
      console.log(res);
      if (res) {
        this.setState({
          isLoading: false,
          errors: [],
          successMessage: "URL has been saved successful.",
          messageVisible: true,

          rowKey: "",
          pageURL: "",
          SaveURL: "",
         
        });

        this.loadData();
      }
      else {
        this.setState({ errors: [res.message], messageVisible: true, successMessage: "", isLoading: false, });
      }
    }
  }

  validateSave() {
    let errors = [];

    if (this.state.SaveURL.trim() === "") {
      errors.push("* URL cannot be blank.");
    }
    if (errors.length > 0) {
      this.setState({
        errors, messageVisible: true,
        successMessage: '',
      })
      return false;
    } else
      return true;
  }


  validateEdit() {
    let errors = [];

    if (this.state.editURL.trim() === "") {
      errors.push("* URL cannot be blank.");
    }
    if (errors.length > 0) {
      this.setState({
        errors, messageVisible: true,
        successMessage: '',
      })
      return false;
    } else
      return true;
  }


  async handleEditBtn() {
    // console.log("edit clicked")
    // console.log(this.state.editURL)
    // console.log(data)
    this.setState({ isLoading: true });
    this.clearMessages();
    if (this.validateEdit() === false) return;
    // console.log("this.state");
    // console.log(this.state);
    var res = await EditPageFeature(this.state);
    // console.log(res);
    if (res) {
      this.setState({
        isLoading: false,
        errors: [],
        successMessage: "URL has been Edited successful.",
        messageVisible: true,

        rowKey: "",
        pageURL: "",
        editURL: "",
      });
    } else {
      this.setState({ errors: [res.message], messageVisible: true, successMessage: "", isLoading: false, });
    }
    this.loadData();

    // console.log("res");
    // console.log(res);
  }

  updateState(prop, value) {
    this.setState({ [prop]: value });
  }

  renderRoleListTable = () => {
    let { feature, data } = this.state;
    if (data.length <= 0) return <div style={{padding : "10px" , backgroundColor: "#dc3545" , marginTop : "50px" , marginBottom : "50px" , textAlign : "center" , justifyContent : "center"}}>
      <b>No Data To Show</b>
    </div>;
    return (
      <div className="table-responsive">
        <table className="table table-bordered  table-striped table-hover">
          <thead>
            <tr>
              <th>PageFeature ID</th>
              <th>PageURL</th>
              <th>Feature ID</th>
              {feature.editPerm !== 0 || feature.deletePerm !== 0 ?
                <th>Action</th> : ""
              }
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) =>
              (item.pageURL === this.props.location.state.pageURL) ? "" :

                <tr key={idx}>
                  <td>{item.pageFeatureID}</td>
                  <td>{item.pageURL}</td>
                  <td>{item.featureID}</td>
                  <td>
                    <span>
                      <Button color="primary" onClick={() => this.handleEdit(item)} > <i className="fa fa-edit"></i></Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                    </span>
                  </td>

                  <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                    <ModalHeader toggle={() => this.toggle(idx)}>Delete Page Feature URL</ModalHeader>
                    <ModalBody>
                      Are you sure you want to delete "{item.pageURL}"?
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

  render() {
    // console.log("this.props");
    // console.log(this.props.match.params.id);
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Page Feature" subtitle="CBM MIS" className="text-sm-left" />
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardBody>
                <Form>
                  <Row xs='12' lg='12'>
                    <Col xs='12' lg='12'>
                    <FormGroup row>
                        <Label htmlFor="MenuCode" sm={4}>Sub Menu Name</Label>
                        <Col sm={8}>
                          <Input disabled={true} id='MenuCode' placeholder='Menu Code' type='text' value={this.props.location.state.menuCode}></Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label htmlFor="MenuCode" sm={4}>Sub Route URL</Label>
                        <Col sm={8}>
                          <Input disabled={true} id='MenuCode' placeholder='Menu Code' type='text' value={this.props.location.state.pageURL}></Input>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label htmlFor="MenuCode" sm={4}>Create URL</Label>
                        <Col xs="7">
                          <Input maxLength={25} id='MenuCode' placeholder='Create URL' type='text' value={this.state.SaveURL} onChange={(evt) => this.updateState("SaveURL", evt.target.value)}></Input>
                        </Col>
                        <Col xs="1">
                          <Button color="primary" onClick={() => this.handleSaveBtn()}>Save</Button>
                        </Col>
                      </FormGroup>
                        
                      {this.state.editURL === "" ?
                        // console.log("data is not")
                        <FormGroup row>
                          <Label htmlFor="MenuCode" sm={4}>Edit URL</Label>
                          <Col xs="7">
                            <Input disabled={true} id='MenuCode' placeholder='Edit URL' type='text' value={""} ></Input>
                          </Col>
                          <Col xs="1">
                            <Button disabled={true} color="primary">Edit</Button>
                          </Col>
                        </FormGroup>
                        :
                        <FormGroup row>
                          <Label htmlFor="MenuCode" sm={4}>Edit URL</Label>
                          <Col xs="7">
                            <Input disabled={false} id='MenuCode' placeholder='Edit URL' type='text' value={this.state.editURL} onChange={(evt) => this.updateState("editURL", evt.target.value)}></Input>
                          </Col>
                          <Col xs="1">
                            <Button disabled={false} color="primary" onClick={() => this.handleEditBtn()}>Edit</Button>
                          </Col>
                        </FormGroup>
                        // console.log(`${this.state.editURL} has`)
                      }
                    {/* Data saving is fail */}
                    {this.state.errors.length > 0 &&
                        <Alert color="danger" isOpen={this.state.messageVisible} toggle={() => this.setState({ messageVisible: false })}>
                          {this.state.errors.map((msg, index) => (
                            <span key={index}>{msg}<br /></span>
                          ))}
                        </Alert>
                      }
                      {/* Data saving is Successful  */}
                      {this.state.successMessage !== "" &&
                        <Alert isOpen={this.state.messageVisible} toggle={() => this.setState({ messageVisible: false })}>
                          <span>{this.state.successMessage}<br /></span>
                        </Alert>
                      }
                      {this.renderRoleListTable()}

                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="reset" color="info" onClick={() => this.cancelHandle()}  ><i className="fa fa-list-alt"></i> Go To List</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default PageFeatureList;