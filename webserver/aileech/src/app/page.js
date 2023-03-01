import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

async function getData() {
  /*return new Promise((res) => {
    setTimeout(() => {
      res("Dynamic fetched data on the server");
    }, 2000)
  });*/
  return fetch('http://localhost:3000/live-leech', {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json"
    },
    cache: 'no-store',
    body: JSON.stringify({
      prompt: `Is ${Date.now()} grater than ${Date.now()-1000}?`
    }), // body data type must match "Content-Type" header
  })
      .then(response => response.json())
}
export default async function Home() {
  const data = await getData();
  return (
    <main className={styles.main}>
      <h1>{data.choices[0].text}</h1>
    </main>
  )
}
