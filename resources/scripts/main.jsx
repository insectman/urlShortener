import React from 'react';
import ReactDOM from 'react-dom';


class ShortUrlForm extends React.Component {
	
	render() {
		return <form>
			<li className="form-row">
				<label htmlFor = "shortUrl">Shorten your URL</label>
				<input name = "shortUrl" id = "shortUrl" placeholder="Type/paste your URL here"></input>
			</li>
			<li className="form-row">
				<button type="submit">Submit</button>
			</li>
		</form>
	}

}

ReactDOM.render(
	<div className="main-content">
		<ShortUrlForm></ShortUrlForm>
	</div>,
  document.getElementById('root')
);