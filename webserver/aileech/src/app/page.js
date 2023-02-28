import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

async function getData() {
  return new Promise((res) => {
    setTimeout(() => {
      res("Dynamic fetched data on the server");
    }, 2000)
  });
}
export default async function Home() {
  const data = await getData();
  return (
    <main className={styles.main}>
      <h1>{data}</h1>
    </main>
  )
}
