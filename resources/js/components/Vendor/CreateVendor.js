import React, { Component, useState } from "react";
import { Button, ButtonToolbar, Modal } from "react-bootstrap";
import "../css/style_frontend.css";
import Swal from "sweetalert2";
import { defaultRouteLink } from "../../common/config";
import ModalAccountsLedgerList from "../modal/ModalAccountsLedgerList";

class CreateVendor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warehouseList: [],
            toggle: true,
            name: "",
            email: "",
            accounts_no: "",
            phone: "",
            address: "",
            remarks: "",
            accounts_id: "",
            type: 1,
            warehouse_id: [],
            status:1,
        };
    }

    handleInput = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleAccountsid = object => {
        //console.log("accId="+object.id);
        this.setState({
            accounts_no: object.ledger_title,
            accounts_id: object.id
        });
    };

    fetchallwarehouse = async () => {
        const response = await axios.get(defaultRouteLink + "/api/all-data");
        console.log(response);

        this.setState({ warehouseList: response.data.warehouses });
    };

    async componentDidMount() {
        this.fetchallwarehouse();
    }

    Createvendor = async event => {
        event.preventDefault();

        const res = await axios.post(
            defaultRouteLink + "/api/save-vendor",
            this.state
        );
        this.setState({
            name: "",
            email: "",
            phone: "",
            address: "",
            remarks: "",
            accounts_no: "",
            type:1,
            status:1
        });
        if (res.data.status === 200) {
            this.props.history.push(defaultRouteLink + "/manage-vendor");
        }
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: toast => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: "success",
            title: "Vendor Create  Successfully!!"
        });
    };

    render() {
        let warhouses = this.state.warehouseList.map((item, index) => {
            // if (warhouses.length === 0) return 1;

            return <option value={item.id}> {item.name}</option>;

            this.setState({
                warehouse_id: item.id
            });
        });

        return (
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-xs-12">
                        <h4 className="page-title"></h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card-box">
                            <h4 className="card-title">Create Vendor</h4>
                            <form
                                className="form-horizontal"
                                onSubmit={this.Createvendor}
                            >
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Name
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                name="name"
                                                required
                                                value={this.state.name}
                                                onChange={this.handleInput}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Email
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                name="email"

                                                value={this.state.email}
                                                onChange={this.handleInput}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Warehouse
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <select
                                                className="form-control"
                                                id="exampleFormControlSelect1"
                                                name="warehouse_id"
                                                onChange={this.handleInput}
                                            >
                                                <option value="0">
                                                    Choose One{" "}
                                                </option>
                                                {warhouses}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Address
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Address"
                                                name="address"

                                                value={this.state.address}
                                                onChange={this.handleInput}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Phone
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="phone"
                                                name="phone"
                                                required
                                                value={this.state.phone}
                                                onChange={this.handleInput}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Type
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <select
                                                className="form-control"
                                                id="exampleFormControlSelect1"
                                                name="type"
                                                onChange={this.handleInput}
                                            >
                                                <option value="0">
                                                    Choose One{" "}
                                                </option>
                                                <option value="1">
                                                    {"Vendor "}
                                                </option>
                                                <option value="2">
                                                    {"Customer"}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Remarks
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <textarea
                                                className="form-control"
                                                placeholder="remarks"
                                                name="remarks"

                                                value={this.state.remarks}
                                                onChange={this.handleInput}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Account No
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Accounts No"
                                                name="accounts_no"

                                                value={this.state.accounts_no}
                                                data-id={this.state.accounts_id}
                                                onChange={this.handleInput}
                                            />
                                            <ModalAccountsLedgerList
                                                handleAccountsid={
                                                    this.handleAccountsid
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-lg-2">
                                        Status
                                    </label>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <select
                                                className="form-control"
                                                id="exampleFormControlSelect1"
                                                name="status"
                                                onChange={this.handleInput}
                                                required
                                            >
                                                <option selected>Choose one </option>
                                                <option value="1">
                                                    Active
                                                </option>
                                                <option value="2">
                                                    Inactive
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label col-lg-2"></label>
                                    <div className="col-md-10">
                                        <div className="input-group">
                                            <button className="btn btn-primary text-center">
                                                save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateVendor;
