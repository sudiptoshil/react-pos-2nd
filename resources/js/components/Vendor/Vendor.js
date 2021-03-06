import React, { Component } from "react";
import { Link } from "react-router-dom";
import { defaultRouteLink } from "../../common/config";

class Vendor extends Component {
    render() {
        {
            props => <PageStart {...props} key={this.props.location.key} />;
        }

        const { vendor } = this.props;
        return vendor.map(vendor => {
            let types;
            if (vendor.type == 1) {
                types = "vendor";
            } else {
                types = "customer";
            }
            return (
                <tr>
                    <td>{vendor.id}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.address}</td>
                    <td>{vendor.phone}</td>
                    <td>{types}</td>
                    <td>{vendor.remarks}</td>
                    <td>{vendor.wname}</td>
                    <td>{vendor.accounts_no}</td>

                    <td>
                        <Link
                            to={defaultRouteLink + `/edit-vendor/${vendor.id}`}
                            className="btn btn-primary"
                            type="button"
                        >
                            Edit
                        </Link>
                    </td>
                </tr>
            );
        });
    }
}

export default Vendor;
