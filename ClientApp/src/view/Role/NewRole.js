import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button, Form, Input, FormGroup, Alert, Container, Label } from 'reactstrap';
import PageTitle from '../../components/common/PageTitle';
import { SelectByID } from "../../api/Role";
import { fetchDuplicateRole } from "../../api/Role";
import { saveRole } from "../../api/Role";

class NewRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formState: "new",
            //Determine this page is for create or edit
            roleKey: "",
            //Selected Item's Key From RoleList
            rowKey: "",
            //Selected Item's Key From DB
            roleName: "",
            //Selected Item's Name From DB
            recordStatus: "Active",
            //Selected Item's Status From DB
            isLoading: false,

            //Show Data is saving is successful or faill
            errors: [],
            successMessage: '',
            messageVisible: false,
        }
    }

    async componentDidMount() {
        //get selected id
        const roleKey = this.props.match.params.id;
        console.log(this.props);
        //if has rolekey , set rolekey to state and run loadData()
        //to become this page is editRole
        if (roleKey) {
            this.setState({
                //roleKey = roleKey
                roleKey,
            }, () => this.loadData())
        }
        //if not has rolekey , this page is become newRole
    }

    //change edit page and set selected item name and status
    async loadData() {
        const roleKey = this.state.roleKey;
        if (roleKey) {
            this.setState({ isLoading: true });
            const rowKey = roleKey;
            const res = await SelectByID(rowKey);
            if (res) {
                this.setState({
                    isLoading: false,
                    //to change this page is edit Page
                    formState: 'edit',
                    //get selected item' key from DB
                    rowKey: rowKey,
                    //get selected item' RoleName from DB
                    roleName: res.roleName,
                    //get selected item' RecordStatus from DB
                    recordStatus: res.recordStatus,
                });
            }
        }
    }

    //Create Or Edit Data Function
    updateState(prop, value) {
        this.setState({ [prop]: value }, () => console.log(this.state));
    }

    //Reset Button
    resetHandle() {
        this.setState({
            rowKey: "",
            roleName: "",
            recordStatus: "Active",
        })

    }

    //Cancel Button
    cancelHandle() { this.props.history.push({ pathname: "/Role/RoleList" }) }

    //Submit Button
    async submitHandle() {
        this.setState({ isLoading: true });
        this.clearMessages();
        var count = await fetchDuplicateRole(this.state.roleName);
        //if validate() is return false , do nothing , can't be blank in input
        if (this.validate() === false) return;
        // console.log(count);
        // 1 !== 0 (mean data is already existed)
        if (count !== 0 && this.state.formState === "new") {
            this.setState({
                messageVisible: true,
                errors: ["* Role Name is already exist."]
            })
            return;
        }
        else {
            console.log("this.state");
            console.log(this.state);
            var res = await saveRole(this.state);
            console.log("res");
            console.log(res);
            // data:null
            // message:""
            // status:true

            //if res is has something
            if (res) {
                //if data is successfully saving in db
                this.setState({
                    isLoading: false,
                    errors: [],
                    successMessage: "Role has been saved successful.",
                    messageVisible: true,

                    rowKey: "",
                    roleName: "",
                    recordStatus: "Active",

                });
            }
            //if res is hasn't something
            else {
                this.setState({ errors: [res.message], messageVisible: true, successMessage: "", isLoading: false, });
            }
        }
    }

    //Clear Data is saving is successful or faill
    clearMessages() {
        this.setState({
            errors: [],
            successMessage: "",
        });
    }

    //If user not set data and save data case
    validate() {
        let errors = [];

        if (this.state.roleName.trim() === "") {
            errors.push("* Role Name cannot be blank.");
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

    render() {
        let { isLoading, recordStatus } = this.state;
        return (
            <>
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        {this.state.formState === "new" ?
                            <PageTitle sm="4" title="New Role" subtitle="CBM MIS" className="text-sm-left" /> :
                            <PageTitle sm="4" title="Edit Role" subtitle="CBM MIS" className="text-sm-left" />
                        }
                    </Row>
                    <Row>
                        <Col xs="12" lg="6">
                            <Card>
                                <CardBody>
                                    <Form>
                                        <Row xs="12" lg="12">
                                            <Col xs="12" lg="12">
                                                <FormGroup row>
                                                    <Col xs="2" lg="2">
                                                        <label htmlFor="roleName">Role Name</label>
                                                    </Col>
                                                    <Col xs="4" lg="4">
                                                        <Input id='roleName' placeholder='Role Name' type='text' value={this.state.roleName} onChange={(evt) => this.updateState("roleName", evt.target.value)} />
                                                    </Col>
                                                </FormGroup>
                                                {/* /////////////////////////////// Group*/}
                                                {/* {(this.state.SelectGroup === 'MG') ? "" : <FormGroup row>
                                                    <Label
                                                        for="GroupSelect"
                                                        sm={4}
                                                    >
                                                        Group
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input id="GroupSelect" name="select" type="select">
                                                            <option>{`${this.state.roleName}  (${this.state.roleName})`}</option>
                                                        </Input>
                                                    </Col>
                                                </FormGroup>} */}
                                                {/* /////////////////////////////// Menu Group Code*/}
                                                <FormGroup
                                                    check
                                                    inline
                                                >
                                                    <Input id='recordStatus' type="checkbox" checked={recordStatus === "Active"} onChange={() => this.updateState("recordStatus", this.state.recordStatus === "Active" ? "Inactive" : "Active")} />
                                                    <Label check>
                                                        Status
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
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
                </Container>
            </>
        )
    }
}

export default NewRole;