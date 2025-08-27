import { useEffect, useState } from 'react';
import apiClient from '../apiClient';
import gptLogo from '../assets/gpt-logo.png';
export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiClient.get('/api/auth/me')
      .then(({ data }) => mounted && setUser(data.user))
      .catch(() => {
        console.log('[me] failed, clearing token');
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
    return () => { mounted = false; };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-stone-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-md mx-auto bg-white border rounded-md p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Dashboard</h2>
          <button
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
            className="border rounded-md px-3 py-1 text-sm"
          >
            Logout
          </button>
        </div>
        <div className='w-full flex justify-center'>
            <img src={gptLogo} alt="logo" className='w-40 h-40'/>
        </div>
        <p className="mt-4">Hi, <b>{user.displayName || user.email} </b>here to tell you why you should Welcome <b>Rahul</b> to Girl Power Talk</p>
        
        <br />
        <ul className='list-disc list-inside'>
            <li>He works well in a team</li>
            <li>He adapts to new tech stacks fast</li>
            <li>He works well under pressure</li>
            <li>He misses going to the office</li>
            
            
        </ul>
        <br />
        <p className='text-center'>And finally, because he believes in Phil's-osophy </p>
        <p className='italic mt-5'>"Success is 1% inspiration, 98% perspiration, and 2% attention to detail."</p>
        <div className='flex w-full justify-end text-right'><p> - Phil Dunphy</p></div>
        
            <p className='text-[12px] text-center mt-10'>P.S. I hope 2 am still counts as EOD (fingers crossed)</p>
      </div>
    </div>
  );
}
