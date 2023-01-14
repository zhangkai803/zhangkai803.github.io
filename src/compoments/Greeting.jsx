import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Greeting({messages}) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(randomMessage());

  return (
    <div>
      <h3>{greeting}! Thank you for visiting!（也是教程里的东西，感觉有用留着吧）</h3>
      {/* <button onClick={() => setGreeting(randomMessage())}>
        New Greeting
      </button> */}
    </div>
  );
}