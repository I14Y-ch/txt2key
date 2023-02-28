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

  return fetch('https://jsonplaceholder.typicode.com/comments/'+Math.floor(Math.random() * 10), { cache: 'no-store' })
      .then(response => response.json())
}
export default async function Home() {
  const data = await getData();
  return (
    <main className={styles.main}>
      <h1>{JSON.stringify(data)}</h1>
    </main>
  )
}
