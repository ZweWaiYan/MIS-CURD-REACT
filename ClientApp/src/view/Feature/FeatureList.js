import React from "react";
import { Row, Col, Card, CardHeader, Button, CardBody, Alert, Modal, ModalBody, ModalFooter, ModalHeader, Container, Collapse, CardColumns, CardGroup, CardFooter, Table } from 'reactstrap';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { dateFormatter } from '../../components/helper/func';
import { Pagination } from '../../components/Pagination/Pagination';
import PageTitle from '../../components/common/PageTitle';
import { fetchFeatureByFilter } from "../../api/Feature";
import { deleteFeature } from "../../api/Feature";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import DetailPage from "../Route/DetailPage";


class FeatureList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,

            //for Pagination
            currentPage: 1,
            totalPage: 0,
            rowPerPage: 10,
            totalRecord: 0,


            //For Admin Permisstion (Edit and Delete)
            feature: {},

            //Data is saving is successful or not
            errorMessage: "",
            successMessage: "",

            //Delete Box
            deleteModal: false,

            //Drop Down
            dropDownOpen: false,
            selectDropDown: "",
            // displaySubRoute: false,
            // groupSubRoute: '',


            // collapse: -1,
            // holes: [],
            // successMessagetable: "",

            routeName : "",
        }
    }

    async componentDidMount() {
        this.loadData();
    }

    async loadData(isContinueFetch = false) {
        this.setState({ isLoading: true });
        console.log(this.state.selectDropDown);
        const { currentPage, rowPerPage } = this.state;
        const res = await fetchFeatureByFilter(currentPage, rowPerPage);
        this.setState({
            data: res.featureRecords,
            totalRecord: res.featureTotalRecord,
            totalPage: Math.ceil(res.featureTotalRecord / rowPerPage)
        }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));
    }

    async loadOptions() { }

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

    toggle(index) {
        const { deleteModal } = this.state;
        this.setState({ deleteModal: deleteModal === index ? -1 : index });
    }

    toggleDropDown() {
        let { dropDownOpen } = this.state;
        this.setState({
            dropDownOpen: !dropDownOpen,
        })
    }

    clearMessages() {
        this.setState({
            errorMessage: "",
            successMessage: ""
        });
    }

    async handleDelete(rowObj) {
        this.setState({ isLoading: true });
        this.clearMessages();
        var res = await deleteFeature(rowObj);
        if (res) {
            this.loadData();
            this.setState({ successMessage: "Delete " + rowObj.roleName + " Successful.", deleteModal: -1, isLoading: false });
        } else {
            this.setState({ errorMessage: res.message, deleteModal: -1, isLoading: false });
        }
    }

    New() {
        this.props.history.push({ pathname: "/newfeature" });
    }

    handleEdit(featureID) {
        console.log(`/editfeature/${featureID}`);
        this.props.history.push({ pathname: `/editfeature/${featureID}`});
    }

    ToPageFeature(data) {
        // console.log("data");
        // console.log(data.featureID);
        this.props.history.push({ pathname: `/pagefeature${data.pageURL}`, state: data });
    }

    ToDetailFeature(data) {
        console.log(data.pageURL);
        console.log(`/${data.menuGroupCode + data.pageURL}`);
        this.props.history.push({pathname: `/${data.menuGroupCode + data.pageURL}` , state: data});
        // this.props.history.push({ pathname: `/feature${data.pageURL}`, state: data });
    }

    DropDownMenu(){
        console.log(this.state.selectDropDown);
    }
    // DisplaySubRoute(index, data) {
    //     const { displaySubRoute } = this.state;
    //     this.setState({ displaySubRoute: displaySubRoute === index ? -1 : index });
    //     console.log(data);
    //     this.setState({ groupSubRoute: data });
    // }

    renderRoleListTable = () => {
        let { feature, data } = this.state;
        if (data.length <= 0) return <b>No Data To Show</b>;
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-hover ">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Menu</th>
                            <th>Group</th>
                            <th>Module</th>
                            <th>Page URL</th>
                            {/* <th>Updated Date</th>
                            <th>Update By</th> */}
                            {feature.editPerm !== 0 || feature.deletePerm !== 0 ?
                                <th>Action</th> : ""
                            }
                        </tr>
                    </thead>
                    <tbody>

                        {data.map((item, idx) =>
                        (item.menuType === "ME" ?
                            <tr key={idx}>

                                <td  className="text-right">{item.menuName}</td>
                                <td  className="text-right">{item.menuCode}</td>
                                <td  className="text-right">{item.menuGroupCode}</td>
                                <td  className="text-right">{item.moduleCode}</td>
                                <td onClick={() => this.ToDetailFeature(item)} style={{color: "blue"}} className="text-right">{item.pageURL}</td>
                                {/* <td className="text-right">{item.pageURL}</td> */}
                                {/* <BrowserRouter>
                                <nav>
                                <td className="text-right"><Link to = {`/feature${item.pageURL}`}>{item.pageURL}</Link></td>
                                </nav>
                                <Switch>
                                    <Route path={'/feature/:type'}><DetailPage/></Route>
                                </Switch>
                                </BrowserRouter> */}
                                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                                    <td></td> :
                                    <>
                                        <td>
                                            <span>
                                                <Col>
                                                    <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    {item.menuType === "ME" ?
                                                        <Button style={{ marginTop: "5px" }} color="warning" onClick={() => this.ToPageFeature(item)}>Route</Button> :
                                                        ""
                                                    }
                                                </Col>
                                            </span>
                                        </td>
                                    </>
                                }

                                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                    <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                    <ModalBody>
                                        Are you sure you want to delete "{item.menuCode}"?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                        <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                    </ModalFooter>
                                </Modal>
                            </tr>
                            :
                            <tr key={idx} >
                                <th>{item.menuName}</th>
                                <th>{item.menuCode}</th>
                                <th>{item.menuGroupCode}</th>
                                <th>{item.moduleCode}</th>
                                <th>{item.pageURL}</th>
                                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                                    <td></td> :
                                    <>
                                        <td>
                                            <span>
                                                <Col>
                                                    <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                </Col>
                                            </span>
                                        </td>
                                    </>
                                }

                                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                    <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                    <ModalBody>
                                        Are you sure you want to delete "{item.menuCode}"?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                        <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                    </ModalFooter>
                                </Modal>
                            </tr>
                        )
                        )}
                        {/* {data.map((item, idx) =>
                        (item.menuType === "MG" ?
                            <>
                                <tr key={idx}>
                                    <td>{item.menuName}</td>
                                    <td>{item.menuCode}</td>
                                    <td>{item.menuGroupCode}</td>
                                    <td>{item.moduleCode}</td>
                                    <td>{item.pageURL}</td>
                                    <td>
                                        <span>
                                            <Col>
                                                <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                &nbsp;&nbsp;&nbsp;
                                                <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                &nbsp;&nbsp;&nbsp;
                                                <Button style={{ marginTop: "5px" }} color="success" onClick={() => this.DisplaySubRoute(idx, item.menuGroupCode)}>Sub Route</Button>
                                            </Col>
                                        </span>
                                    </td>
                                    <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                        <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                        <ModalBody>
                                            Are you sure you want to delete "{item.menuCode}"?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                            <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                        </ModalFooter>
                                    </Modal>
                                </tr>
                                <tr>
                                    <td colSpan="5" style={{ padding: "0" }}>
                                        <Collapse isOpen={this.state.displaySubRoute === idx} toggle={() => this.DisplaySubRoute(idx)}>
                                        {data.map((item, idx) =>
                                                    (item.menuType === "ME" && item.menuGroupCode === this.state.groupSubRoute ?
                                                        <tr key={idx}>

                                                            <td>{item.menuName}</td>
                                                            <td>{item.menuCode}</td>
                                                            <td>{item.menuGroupCode}</td>
                                                            <td>{item.moduleCode}</td>
                                                            <td>{item.pageURL}</td>
                                                            <td>
                                                                <span>
                                                                    <Col>
                                                                        <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                                        &nbsp;&nbsp;&nbsp;
                                                                        <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                                        &nbsp;&nbsp;&nbsp;
                                                                        {item.menuType === "ME" ?
                                                                            <Button style={{ marginTop: "5px" }} color="warning" onClick={() => this.ToPageFeature(item)}>Route</Button> :
                                                                            ""
                                                                        }
                                                                    </Col>
                                                                </span>
                                                            </td>

                                                            <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                                                <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                                                <ModalBody>
                                                                    Are you sure you want to delete "{item.menuCode}"?
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                                                    <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                        </tr>
                                                        :
                                                        ""
                                                    ))} 
                                        </Collapse>
                                    </td>
                                </tr>
                            </>
                            :
                            ""
                        )
                        )} */}
                    </tbody>
                </table>
            </div>
        );
    }

    // renderList(){
    //     return this.state.data.map((row,index) => {
    //         return (
    //             <tbody key={row.featureID}> 
    //                 <tr>
    //                     <td>{row.menuName}</td>
    //                     <td>{row.menuType}</td>
    //                     <td>{row.menuGroupCode}</td>
    //                     <td>{row.menuCode}</td>
    //                     <td>
    //                         <Button color="success" onClick={() => this.Score(index,row.menuGroupCode)}>Score</Button>
    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td colSpan="6" style={{padding: "0"}}> 
    //                         <Collapse isOpen={this.state.collapse === index} onClick={() => this.toggleTest(index)}>
    //                             <table>
    //                                 <tbody>
    //                                 <tr>
    //                                     <th>{row.menuName}</th>
    //                                     <th>{row.menuType}</th>
    //                                     <th>{row.menuGroupCode}</th>
    //                                     <th>{row.menuCode}</th>
    //                                 </tr>
    //                                 </tbody>                             
    //                             </table>
    //                         </Collapse>
    //                     </td>
    //                 </tr>
    //             </tbody>
    //         )
    //     })
    // }

    // Score(index,Group){  
    //     this.setState({groupSubRoute : Group})
    //     if(this.state.collapse === index){
    //         let datas = this.state.data;
    //         if(this.state.data.length > 0){
    //             datas[index].holes = this.state.holes;
    //         }
    //         this.setState({
    //             collapse : -1,
    //             data: datas,
    //             successMessagetable: "",
    //         })
    //     }
    //     else if(this.state.collapse !== -1 && this.state.collapse !== index){
    //         console.log(`this.state.collapse === index && this.state.collapse !== index`)
    //         console.log(`${this.state.collapse} !== ${index}`)
    //         let datas = this.state.data;
    //         if (this.state.data.length > 0) {
    //             datas[this.state.collapse].holes = this.state.holes;
    //         }
    //         this.setState({
    //             collapse: index,
    //             data: datas,
    //             holes: this.state.data[index].holes,
    //             successMessagetable: "",
    //         });
    //     }
    //     else {
    //         this.setState({
    //             collapse: index,
    //             holes: this.state.data[index].holes,
    //             successMessagetable: "",
    //         });
    //     }
    // }

    toggleTest(index) {
        let { collapse } = this.state;
        this.setState({
            collapse: collapse === index ? -1 : index
        });
    }

    render() {
        const { data, totalPage, currentPage, rowPerPage, totalRecord, selectDropDown, feature, isLoading } = this.state;
        return (
            <>
                {isLoading && <LoadingSpinner />}
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        <PageTitle sm="4" title="Feature List" subtitle="CBM MIS" className="text-sm-left" />
                    </Row>
                    <Row >
                        {this.state.isLoading && <LoadingSpinner />}
                        <Col xs="12" lg="12">
                            <Card>
                                <CardHeader>
                                    <Row xs="0" className="float-right">
                                        {/* <Dropdown isOpen={this.state.dropDownOpen} toggle={() => this.toggleDropDown()}>
                                            <DropdownToggle caret>{this.state.selectDropDown}</DropdownToggle>
                                            <DropdownMenu>
                                                {data.map((item) =>
                                                    item.menuType === "MG" ? <>
                                                        <DropdownItem onClick={() => { {(evt) => this.setState("selectDropDown", evt.target.value)}{this.DropDownMenu()}} }>{item.menuCode}</DropdownItem>
                                                        <DropdownItem divider />
                                                    </> : ""
                                                )}
                                            </DropdownMenu>
                                        </Dropdown> */}
                                        &nbsp;&nbsp;&nbsp;
                                        <Button color="primary" onClick={() => this.New()}>New Feature</Button>
                                        &nbsp;&nbsp;&nbsp;
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {this.state.errorMessage !== "" &&
                                        <Alert theme="danger">{this.state.errorMessage}</Alert>
                                    }
                                    {this.state.successMessage !== "" &&
                                        <Alert theme="success">{this.state.successMessage}</Alert>
                                    }
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

            // <Row>
            //     <Col xs = "12" lg ="12">
            //         <Card>
            //             <CardHeader>
            //                 <Row>
            //                     <Col>
            //                     <Button color="success">New</Button>
            //                     </Col>
            //                 </Row>
            //             </CardHeader>

            //             <Table responsive bordered hover>
            //                 <thead>
            //                     <tr className="text-center">
            //                     </tr>

            //                     <tr>
            //                         <th>MenuName</th>
            //                         <th>MenuType</th>
            //                         <th>MenuGroup</th>
            //                         <th>MenuCode</th>
            //                         <th>Action</th>
            //                     </tr>
            //                 </thead>

            //                 {this.renderList()}
            //             </Table>
            //         </Card>
            //     </Col>
            // </Row>
        );
    }
}

export default FeatureList;