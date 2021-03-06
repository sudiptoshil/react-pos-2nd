import React, { Component } from "react";
import { defaultRouteLink } from "../../common/config";
import { Link } from "react-router-dom";
import Vendor from "../Vendor/Vendor";
import Customer from "./Customer";
import ContentLoader, { Facebook, BulletList } from "react-content-loader";
const MyBulletListLoader = () => <BulletList />;
class ManageCustomer extends Component {
    // state declaration
    state = {
        customers: [],
        loading: true
    };

    // get all customer from customers table ..
    fetchallCustomer = async () => {
        const res = await axios.get(defaultRouteLink + "/api/all-customer");
        if (res.data.status === 200) {
            this.setState({ customers: res.data.customer });
            this.setState({ loading: false });
        }
        console.log(res);
    };

    componentDidMount = () => {
        this.fetchallCustomer(); // calling  fetchallCustomer function
    };

    render() {
        //  first page loading icon
        if (this.state.loading) {
            return <MyBulletListLoader />;
        }

        return (
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-xs-6">
                        <h4 className="page-title"></h4>
                    </div>

                    <Link
                        to={defaultRouteLink + "/create-customer"}
                        type="button"
                        className="btn btn-primary"
                    >
                        Create Customer
                    </Link>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card-box">
                            <div className="card-block">
                                <h6 className="card-title text-bold"></h6>
                                <p className="content-group"></p>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <td>SL</td>
                                            <td>Name</td>
                                            <td>Email</td>
                                            <td>Address</td>
                                            <td>Phone</td>
                                            <td>Remarks</td>
                                            <td>WareHouse Name</td>
                                            <td>Accounts No</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Customer.js component   */}
                                        <Customer
                                            customer={this.state.customers}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageCustomer;
