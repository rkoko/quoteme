import React from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import QuoteNavigation from './QuoteNavigation';
import QuotesBody from './QuotesBody';
import QuoteFooter from './QuoteFooter'

class QuotesDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      quote: {},
      fireRedirect: false,
      textInput: '',
      authorInput: '',
      modalIsOpen: false,
      submittedQuote: {}
    }
  }

  fetchQuote(id) {
    axios.get(`api/quotes/${id}`)
      .then(response => {
        this.setState({ quote: response.data })
      })
      .catch(error => {
        console.error(error)
        this.setState({ fireRedirect: true })
      })
  }

  toggleModal = () => {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value
      })
  }

  handleSubmit = (event) =>{
    event.preventDefault()
    axios.post(`api/quotes`, {
      text: this.state.textInput,
      author: this.state.authorInput
    })
    .then((res) => {
      this.setState({
        textInput: '',
        authorInput: '',
        modalIsOpen: false,
        submittedQuote: res.data
      })
    })
    .then(() => {
      this.props.history.push(`/?quote=${this.state.submittedQuote.id}`)
    })
  }

  setQuoteIdFromQueryString(qs) {
    this.qsParams = queryString.parse(qs)
    if (this.qsParams.quote) {
      // assign quote ID from the URL's query string
      this.quoteId = Number(this.qsParams.quote)
    } else {
      this.quoteId = this.props.startingQuoteId
      // update URL in browser to reflect current quote in query string
      this.props.history.push(`/?quote=${this.quoteId}`)
    }
  }

  componentDidMount() {
    this.setQuoteIdFromQueryString(this.props.location.search)
    this.fetchQuote(this.quoteId)
  }

  componentWillReceiveProps(nextProps) {
    this.setQuoteIdFromQueryString(nextProps.location.search)
    this.fetchQuote(this.quoteId)
  }

  render() {
      const quote = this.state.quote
      const nextQuoteId = quote.next_id
      const previousQuoteId = quote.previous_id
    return (
      <div>
        <div className='quote-container'>
          {this.state.fireRedirect &&
            <Redirect to={'/'} />
          }
          {previousQuoteId != null ?   <QuoteNavigation direction='previous' otherQuoteId={previousQuoteId} /> : null }

          <QuotesBody quote={this.state.quote} />

          {nextQuoteId != null ? <QuoteNavigation direction='next' otherQuoteId={nextQuoteId} /> : null}
        </div>

        <div className='form-container'>

        {!this.state.modalIsOpen ?
          <button onClick={this.toggleModal}>Submit a quote</button> :
          null}

        {this.state.modalIsOpen ?
          <div className='form'>
            <form onSubmit={this.handleSubmit}>
              <label>Text: </label>
              <input
                required
                type="text"
                name="textInput"
                value={this.state.textInput}
                onChange={this.handleChange}
              />
              <label>Author: </label>
              <input
                required
                type="text"
                name="authorInput"
                value={this.state.authorInput}
                onChange={this.handleChange}
              />
              <button type="submit" >Add Quote</button>
            </form>
          </div> :
          null}
        </div>

        {this.state.quote.id !== parseInt(this.props.startingQuoteId, 10) &&
          <QuoteFooter startingQuoteId = {this.props.startingQuoteId}/>
        }
      </div>
    )
  }
}

export default QuotesDisplay
