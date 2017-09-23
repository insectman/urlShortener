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

		jQuery.post( "/shorten", { originalURL: that.shortURLInput.value, _csrf: jQuery('#root').data('csrf') }).done((resp) => {

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
		return <form className = {this.state.requestPending && "form-pending"} onSubmit = {this.handleSubmit} >

			<UrlFormRow 
				urlIsChecked = {this.state.urlIsChecked }
				errorMessage = {this.state.errorMessage}
				requestPending = {this.state.requestPending}
				shortURLInputRef = {el => { this.shortURLInput = el}}>
			</UrlFormRow>
			{ this.state.shortUrl && 
			<li className="form-row">
				<label>Your shortened URL. You can share it.</label>
				<input value = {this.state.shortUrl}>
				</input>
			</li> }
			<li className="form-row">
				<button type="submit" disabled = {this.state.requestPending}>Submit</button>
			</li>
		</form>
	}

}

function UrlFormRow(props) {

	return <li className="form-row">
		{
			(props.urlIsChecked && props.errorMessage) ? 
			<label className = "label-error" htmlFor = "shortUrl">{'Error:'+props.errorMessage+'. Try another URL'}</label> :
			<label htmlFor = "shortUrl">{props.requestPending ? 'Pending...' : 'Shorten your URL'}</label>
		}
		<input name = "shortUrl" ref={props.shortURLInputRef} placeholder="Type/paste your URL here"></input>
	</li>

}


ReactDOM.render(
	<div className="main-content">
		<ShortUrlForm shortUrl = ""></ShortUrlForm>
	</div>,
  document.getElementById('root')
);