/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { post } from '../../services/request';
import Logo from '../../static/images/CTI.svg';

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
	host: '192.168.182.160',
	port: '5001',
	protocol: 'http'
});

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	form: {
		width: 310
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	fileField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 300
	},
	menu: {
		width: 200
	},
	submitWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		padding: '20px 0px'
	},
	submitImage: {
		padding: '50px'
	},
	logoImage: {
		objectFit: 'contain',
		maxWidth: 400
	},
	submitFormWrapper: {
		flex: 1,
		height: '100%',
		padding: '20px'
		// background: "rgba(0, 0, 0, 0.5)"
	},
	styleText: {
		fontFamily: 'Arial'
	}
});

class SubmitForm extends Component {
	handleOnClick() {
		console.log('Clicked');
		let file = document.getElementById('submit-file').files[0];

		//console.log(file.text())

		(async () => {
			try {
				const cid = await ipfs.add(file);
				console.log(cid);

				let org = document.getElementById('orgName').value;
				let peer = document.getElementById('peerName').value;
				let orgPeer = org.toString() + '-' + peer.toString();
				// submit cid to blockchain
				post('/apiV2/submit', [orgPeer, cid[0]]).then(res => {
					const submitBadget = document.getElementById('statusSubmit');
					const { response } = res;
					if (response) {
						submitBadget.innerHTML = response.toString();
						console.log(response);
					} else {
						submitBadget.innerHTML = 'Submit Faild!';
					}
				});
			} catch (err) {
				console.log(err);
			}
		})();
	}

	render() {
		const { classes } = this.props;

		return (
			// TODO : Replace with liform-react
			<div className={classes.submitWrapper}>
				<div className={classes.submitImage}>
					<img src={Logo} alt="submit logo" className={classes.logoImage} />
				</div>
				<div className={classes.submitFormWrapper}>
					<h2 className={classes.styleText}>SUBMIT HERE</h2>
					<form className={classes.form}>
						<TextField
							id="orgName"
							label="Your Organization"
							className={classes.textField}
							margin="normal"
						/>

						<TextField
							id="peerName"
							label="Your User ID"
							className={classes.textField}
							margin="normal"
						/>

						<TextField
							type="file"
							id="submit-file"
							label="Submit"
							className={classes.fileField}
							helperText="Json File submit"
							margin="normal"
						/>
						<Button
							class="Transactions-searchButton-99 btn btn-success"
							margin="normal"
							type="button"
							onClick={this.handleOnClick}
						>
							Submit
						</Button>
						<p id="statusSubmit" />
					</form>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(SubmitForm);
