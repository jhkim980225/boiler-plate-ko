import React, {useEffect} from 'react'

import axios from 'axios'

function LandingPage() {

  
  // LandingPage 접속 시 /api/hello로 axios 요청. 성공 시 data로 담음
  useEffect(() => {
    axios.get('/api/hello')
        .then(response => {
            console.log(response);  
        })
}, []);

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage
