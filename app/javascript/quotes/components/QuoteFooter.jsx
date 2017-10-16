import React from 'react';
import { Link } from 'react-router-dom';

const QuoteFooter = ({startingQuoteId}) => (
  <div id='footer'>
    <Link className='btn btn-primary' to={`/?quote=${startingQuoteId}`}>
      Back to Beginning
    </Link>
  </div>
)

export default QuoteFooter
