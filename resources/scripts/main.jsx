import React from 'react';
import ReactDOM from 'react-dom';


class ShortUrlForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			requestPending : false,
			urlIsChecked : false,
			urlIsValid : false,
			shortUrl : null
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		
		event.preventDefault();

		const that = this;

		that.setState({
			requestPending : true,
			urlIsChecked : false,
			urlIsValid : false,
			shortUrl : null
		})

		jQuery.post( "/shorten", { originalURL: that.shortURLInput.value, _csrf: jQuery('#root').data('csrf') }).done((resp) => {
			console.log(resp);
			that.setState({
				requestPending : false,
				urlIsChecked : true,
				urlIsValid : !resp.error,
				shortUrl : !resp.error && resp.shortUrl
			})
		});
	}

	render() {
		return <form className = {this.state.requestPending && "form-pending"} onSubmit = {this.handleSubmit} >

			<UrlFormRow 
				urlIsChecked = {this.state.urlIsChecked }
				urlIsValid = {this.state.urlIsValid}
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
			(props.urlIsChecked && !props.urlIsValid) ? 
			<label className = "label-error" htmlFor = "shortUrl">The URL you entered is invalid. try another one</label> :
			<label htmlFor = "shortUrl">Shorten your URL</label>
		}
		<input name = "shortUrl" ref={props.shortURLInputRef} placeholder="Type/paste your URL here"></input>
	</li>

}


ReactDOM.render(
	<div className="main-content">
		<ShortUrlForm urlIsChecked = {false} urlIsValid = {false} shortUrl = ""></ShortUrlForm>
	</div>,
  document.getElementById('root')
);