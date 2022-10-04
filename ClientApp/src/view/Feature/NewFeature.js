import React from "react";
import { render } from "react-dom";
import {
    Row, Col, Card, CardBody, CardFooter, Button, Form, FormGroup, Alert, Container, Label, Input, FormFeedback
} from 'reactstrap';
import { Select } from 'antd';
import PageTitle from '../../components/common/PageTitle';
import { SelectByID } from "../../api/Feature";
import { fetchDuplicateFeature } from "../../api/Feature";
import { saveRole } from "../../api/Feature";
import { fetchFeatureByFilter } from "../../api/Feature";

class NewFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            formState: "new",
            data: [],

            errors: [],
            successMessage: '',
            messageVisible: false,

            rowKey: "",

            featureID: "",
            MenuCode: "",
            MenuName: "",
            MenuType: "MG",
            MenuGroupCode: "",
            MainMenuGroupCode: "",
            ModuleCode: "",
            PageURL: "",
            DefaultExpanse: "0",
            ExtendedPerm: "",
            HiddenMenu: '0',

            isLoading: false,

            dropdownOpen: false,

            MenuCodeCheck: false,
            MenuNameCheck: false,
            ModuleCodeCheck: false,
            PageURLCheck: false,
        }
    }

    async componentDidMount() {
        const featureID = this.props.match.params.id;
        // console.log("this.props.match.params.id");
        // console.log(featureID);
        if (featureID) {
            this.setState({
                //roleKey = roleKey
                featureID,
            }, () => this.loadData())
        }
        this.loadDataForDropDownList();
    }

    async loadOptions() { }

    async loadDataForDropDownList(isContinueFetch = false) {
        this.setState({ isLoading: true });
        const { currentPage, rowPerPage } = this.state;
        const res = await fetchFeatureByFilter(currentPage, rowPerPage);
        this.setState({
            data: res.featureRecords,
            totalRecord: res.featureTotalRecord,
            totalPage: Math.ceil(res.featureTotalRecord / rowPerPage)
        }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));
    }

    async loadData() {
        const featureID = this.state.featureID;
        // console.log("this.state.featureID");
        // console.log(featureID);
        if (featureID) {
            this.setState({ isLoading: true });
            const rowKey = featureID;
            // console.log(rowKey);
            // console.log(rowKey);
            const res = await SelectByID(rowKey);
            console.log("res");
            console.log(res);
            if (res) {
                this.setState({
                    isLoading: false,
                    formState: 'edit',
                    isLoading: false,
                    rowKey: rowKey,
                    MenuCode: res.menuCode,
                    MenuName: res.menuName,
                    MenuType: res.menuType,
                    MenuGroupCode: res.menuGroupCode,
                    MainMenuGroupCode: res.menuGroupCode,
                    ModuleCode: res.moduleCode,
                    PageURL: res.pageURL,
                    DefaultExpanse: res.defaultExpanse,
                    ExtendedPerm: res.extendedPerm,
                    HiddenMenu: res.hiddenMenu,
                });
            }
        }
    }

    resetHandle() {
        this.setState({
            rowKey: "",
            MenuCode: "",
            MenuName: "",
            MenuType: "MG",
            MenuGroupCode: "",
            MainMenuGroupCode: "",
            ModuleCode: "",
            PageURL: "",
            DefaultExpanse: "0",
            ExtendedPerm: "",
            HiddenMenu: '0',
        })

    }

    clearMessages() {
        this.setState({
            errors: [],
            successMessage: "",
        });
    }

    validate() {
        let errors = [];

        if (this.state.MenuCode.trim() === "") {
            errors.push("* Menu Code cannot be blank.");
        }
        if (this.state.MenuName.trim() === "") {
            errors.push("* Menu Name cannot be blank.");
        }
        if (this.state.ModuleCode.trim() === "") {
            errors.push("* Module Code cannot be blank.");
        }

        if (this.state.PageURL.length === 0){
            errors.push("* PageURL cannot be blank.");
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

    async submitHandle() {
        this.setState({ isLoading: true });
        this.clearMessages();
        //  console.log("this.state.MenuName");
        // console.log("this.state.MenuCode");
        // console.log("this.state.ModuleCode");
        // console.log("this.state.PageURL");
        // console.log(this.state.MenuName);
        // console.log(this.state.MenuCode);
        // console.log(this.state.ModuleCode);
        // console.log(this.state.PageURL);
        // var count = await fetchDuplicateFeature(this.state.MenuName,this.state.MenuCode,this.state.ModuleCode,this.state.PageURL);
        var count = await fetchDuplicateFeature(this.state.MenuName,this.state.MenuCode,this.state.ModuleCode,this.state.PageURL,this.state.MenuType);
        console.log("count");
        console.log(count);
        if (this.validate() === false) return;
        if (count !== 0 && this.state.formState === "new") {
            this.setState({
                messageVisible: true,
                errors: ["* Feature is already exist."]
            })
            return;
        }
        else {
            // console.log(this.state);
            // console.log(this.state.MenuType);
            this.state.MenuType === "MG" ? this.setState({ MenuGroupCode: this.state.MenuCode }) : this.setState({ MenuGroupCode: this.state.MainMenuGroupCode })
            var res = await saveRole(this.state);
            console.log("res");
            console.log(res);
            if (res) {
                this.setState({
                    isLoading: false,
                    errors: [],
                    successMessage: "Feature has been saved successful.",
                    messageVisible: true,

                    rowKey: "",
                    roleName: "",

                })
                {this.resetHandle();}
            }
            else {
                this.setState({ errors: [res.message], messageVisible: true, successMessage: "", isLoading: false, });
            }
        }
    }

    cancelHandle() { this.props.history.push({ pathname: "/feature" }) }

    updateState(prop, value) {
        this.setState({ [prop]: value }, () => console.log(this.state));
    }


    render() {
        const { data } = this.state;
        return (
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    {this.state.formState === "new" ?
                        <PageTitle sm="4" title="New Feature" subtitle="CBM MIS" className="text-sm-left" /> :
                        <PageTitle sm="4" title="Edit Feature" subtitle="CBM MIS" className="text-sm-left" />
                    }
                </Row>
                <Row>
                    <Col xs="12" lg="6">
                        <Card>
                            <CardBody>
                                <Form>
                                    <Row xs="12" lg="12">
                                        <Col xs="12" lg="12">
                                            {/* /////////////////////////////// MenuCode*/}
                                            <FormGroup row>
                                                <Label htmlFor="MenuCode" sm={4}>Menu Code</Label>
                                                <Col sm={8}>
                                                    <Input maxLength={20} id='MenuCode' placeholder='Menu Code' type='text' value={this.state.MenuCode} onChange={(evt) => this.updateState("MenuCode", evt.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            {/* /////////////////////////////// Menu Name*/}
                                            <FormGroup row>
                                                <Label htmlFor="MenuName" sm={4}>Menu Name</Label>
                                                <Col sm={8}>
                                                    <Input maxLength={20} id='MenuName' placeholder='Menu Name' type='text' value={this.state.MenuName} onChange={(evt) => this.updateState("MenuName", evt.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            {/* ///////////////////////////// Menu Type*/}
                                            {/* <Input id='HideThisPage' type="checkbox" checked={this.state.Hide === "1"} onChange={() => this.updateState("Hide", this.state.Hide === "1" ? "0" : "1")} /> */}
                                            &nbsp;
                                            <FormGroup row tag="fieldset">
                                                <Label htmlFor="Menutype" sm={4}>Menu type</Label>
                                                <Col sm={8}>
                                                    <div>
                                                        <FormGroup check>
                                                            <Input
                                                                value={"MG"}
                                                                name="radio1"
                                                                type="radio"
                                                                checked={this.state.MenuType === "MG"}
                                                                onChange={() => this.setState({ "MenuType": "MG" })}
                                                            />
                                                            {' '}
                                                            <Label check>
                                                                Mein Route (MG)
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                    &nbsp;
                                                    <div>
                                                        <FormGroup check>
                                                            <Input
                                                                value={"ME"}
                                                                checked={this.state.MenuType === "ME"}
                                                                // checked={this.state.SelectGroup === "ME"}
                                                                onChange={() => this.setState({ "MenuType": "ME" })}
                                                                name="radio2"
                                                                type="radio"
                                                            />
                                                            {' '}
                                                            <Label check>
                                                                Sub Route (ME)
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                </Col>
                                            </FormGroup>
                                            &nbsp;
                                            {/* /////////////////////////////// Group*/}
                                            {(this.state.MenuType === 'MG') ? "" :

                                                <FormGroup row>
                                                    <Label for="GroupSelect" sm={4}>Group</Label>
                                                    <Col sm={8}>
                                                        <Input id="GroupSelect" name="select" type="select" defaultValue={this.state.MenuGroupCode} onClick={(evt) => this.updateState("MainMenuGroupCode", evt.target.value)} >
                                                            {data.map((item) =>
                                                                item.menuType === "MG" ?
                                                                    <>
                                                                        <option color="gray" disabled={true}>{item.menuName}</option>
                                                                        <option key={item.featureID}>{item.menuGroupCode}</option>
                                                                        <option color="gray" disabled={true}>========================</option>
                                                                    </>
                                                                    : ""
                                                            )
                                                            }
                                                            {/* https://ant.design/components/select/ */}
                                                        </Input>
                                                    </Col>
                                                </FormGroup>
                                            }

                                            {/* /////////////////////////////// Module Code*/}
                                            <FormGroup row>
                                                <Label htmlFor="ModuleCode" sm={4}>Module Code</Label>
                                                <Col sm={8}>
                                                    <Input maxLength={20} id='ModuleCode' placeholder='Module Code' type='text' value={this.state.ModuleCode} onChange={(evt) => this.updateState("ModuleCode", evt.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            {/* /////////////////////////////// Page URL*/}
                                            <FormGroup row>
                                                <Label htmlFor="PageURL" sm={4}>PageURL</Label>
                                                {/* {this.state.MenuType === 'MG' ?
                                                    <Col sm={8}>
                                                        <Input id='PageURL' placeholder='PageURL' type='text' value={`/`}/>
                                                    </Col>
                                                    :
                                                    <Col sm={8}>
                                                        <Input  id='PageURL' placeholder='PageURL' type='text' value={this.state.PageURL} onChange={(evt) => this.updateState("PageURL", evt.target.value)} />
                                                    </Col>
                                                } */}

                                                <Col sm={8}>
                                                    <Input maxLength={25} id='PageURL' placeholder='PageURL' type='text' value={this.state.PageURL} onChange={(evt) => this.updateState("PageURL", evt.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            {/* /////////////////////////////// Default Expanse*/}
                                            <FormGroup row>
                                                <Label htmlFor="DefaultExpanse" sm={4}>Default Expanse</Label>
                                                <Col sm={8}>
                                                    <Input disabled={true} id='DefaultExpanse' type='text' value={this.state.DefaultExpanse} />
                                                </Col>
                                            </FormGroup>
                                            {/* /////////////////////////////// Extended Perm*/}
                                            <FormGroup row>
                                                <Label htmlFor="ExtendedPerm" sm={4}>Extended Perm</Label>
                                                <Col sm={8}>
                                                    <Input disabled={true} id='ExtendedPerm' type='text' value={this.state.ExtendedPerm} />
                                                </Col>
                                            </FormGroup>
                                            {/* /////////////////////////////// Hide this Page*/}
                                            <FormGroup check inline >
                                                <Label check>
                                                    Hide This Page ?
                                                </Label>
                                                &nbsp;&nbsp;&nbsp;
                                                <Input id='HideThisPage' type="checkbox" checked={this.state.HiddenMenu === "1"} onChange={() => this.updateState("HiddenMenu", this.state.HiddenMenu === "1" ? "0" : "1")} />
                                            </FormGroup>
                                            {/* /////////////////////////////// */}
                                        </Col>
                                    </Row>
                                    &nbsp;&nbsp;&nbsp;
                                </Form>
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
                            </CardBody>
                            {(this.state.formState === "new") ?
                                <CardFooter>
                                    <Button type="submit" color="primary" onClick={() => this.submitHandle()} ><i className="fa fa-save"></i> Save</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="reset" color="danger" onClick={() => this.resetHandle()} ><i className="fa fa-ban"></i> Reset</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="reset" color="info" onClick={() => this.cancelHandle()}  ><i className="fa fa-list-alt"></i> Go To List</Button>
                                </CardFooter> : ""
                            }
                            {(this.state.formState === "edit") ?
                                <CardFooter>
                                    <Button type="submit" size="sm" color="primary" onClick={() => this.submitHandle()} ><i className="fa fa-dot-circle-o"></i> Update</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="reset" size="sm" color="danger" onClick={() => this.cancelHandle()} ><i className="fa fa-ban"></i> Cancel</Button>
                                </CardFooter> : ""
                            }
                        </Card>
                    </Col>

                </Row>
            </Container >
        )
    }
}

export default NewFeature;