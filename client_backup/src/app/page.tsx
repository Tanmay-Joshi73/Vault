import Image from "next/image";
import Landing from "./(Landing)/Landing";
import dotenv from 'dotenv'
dotenv.config()

export default function Home() {
  return (
    <Landing />
  );
}
