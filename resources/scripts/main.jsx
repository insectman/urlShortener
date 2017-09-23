import React from 'react';
import ReactDOM from 'react-dom';


class ShortUrlForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			requestPending : false,
			urlIsChecked : false,
			errorMessage : false,
			shortUrl : false
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.selectShortURL = this.selectShortURL.bind(this);
	}

	selectShortURL() {

		this.shortURLInput.select();

	}

	handleSubmit(event) {
		
		event.preventDefault();

		const that = this;

		that.setState({
			requestPending : true,
			urlIsChecked : false,
			errorMessage : false,
			shortUrl : false
		})

		jQuery.post( "/shorten", { 
			originalURL: that.OriginalURLInput.value, 
			shortURL: that.shortURLInput.value,
			_csrf: jQuery('#root').data('csrf') 
			}).done((resp) => {

			that.setState({
				requestPending : false,
				urlIsChecked : true,
				errorMessage : resp.error,
				shortUrl : !resp.error && resp.shortUrl
			})

		}).fail(function(xhr, status, error) {

	        that.setState({
				requestPending : false,
				urlIsChecked : true,
				errorMessage : 'Internal error',
				shortUrl : false
			})

	    });;
	}

	render() {

		let originalUrlFormProps = {...this.state, 
			OriginalUrlInputRef : el => { this.OriginalURLInput = el}
		}

		let shortUrlFormRowProps = {...this.state, 
			selectShortURL : this.selectShortURL,
			ShortUrlInputRef : el => { this.shortURLInput = el}
		}

		return <form className = {this.state.requestPending && "form-pending"} onSubmit = {this.handleSubmit} >

			<OriginalUrlFormRow {...originalUrlFormProps} >
			</OriginalUrlFormRow>
			<ShortUrlFormRow {...shortUrlFormRowProps} >
			</ShortUrlFormRow>
			<li className="form-row">
				<button type="submit" disabled = {this.state.requestPending}>Submit</button>
			</li>
		</form>
	}

}

function OriginalUrlFormRow(props) {

	return <li className="form-row">
		{
			(props.urlIsChecked && props.errorMessage) ? 
			<label className = "label-error" htmlFor = "shortUrl">{'Error:'+props.errorMessage+'. Try another URL'}</label> :
			<label htmlFor = "shortUrl">{props.requestPending ? 'Pending...' : 'Shorten your URL'}</label>
		}
		<input name = "shortUrl" ref={props.OriginalUrlInputRef} placeholder="Type/paste your URL here"></input>
	</li>

}

function ShortUrlFormRow(props) {

	let inpProps = {
		readOnly : !!props.shortUrl,
		onClick : props.shortUrl && props.selectShortURL,
		ref : props.ShortUrlInputRef
	}

	if(props.shortUrl) {
		inpProps.value = props.shortUrl;
	}

	return <li className="form-row">
		<label>
			{ props.shortUrl ? 
				'Your shortened URL. You can share it.' 
				: 'Enter your desired url or leave it blank to be generated randomly (alphanumeric characters only)'}
		</label>
		<input {...inpProps} ></input>
	</li>

}

ReactDOM.render(
	<div className="main-content">
		<ShortUrlForm shortUrl = ""></ShortUrlForm>
	</div>,
  document.getElementById('root')
);