import Image from 'next/image';
import { Inter } from 'next/font/google';
import Modbus from 'jsmodbus';
import { useState, useEffect } from 'react';
import axios from 'axios';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [flag, setFlag] = useState(false);
  const [hum, setHum] = useState(0);
  const [inputValue, setInputValue] = useState({
    reg: '',
    val: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/hello', { data: inputValue });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (inputValue.reg !== '' && inputValue.val !== '') {
      fetchData();
    }
  }, [inputValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue((prev) => ({
      ...prev,
      val: event.target.value,
    }));
  };

  const handleInput = (e) => {
    e.preventDefault();
    setInputValue((prev) => ({
      ...prev,
      reg: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/hello', { data: inputValue });
        console.log(response.data);
        setHum(response.data.value);
      } catch (error) {
        console.error(error);
      }
    };

    if (flag) {
      fetchData();

      setInterval(() => {
        fetchData();
      }, 5000);
    }
  }, [inputValue, flag]);

  const handleHum = async ({ target }) => {
    setInputValue((prev) => ({
      ...prev,
      reg: target.value,
    }));
    setFlag(true);
  };

  return (
    <main
      className={`flex space-y-40 flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <form className="space-y-4 flex flex-col">
        <div className="space-x-4">
          <button
            type="text"
            value={4001}
            className="border w-32 h-32 rounded-full"
            onClick={handleInput}
          >
            Sound Buzzer
          </button>
        </div>
        <button
          type="submit"
          value={'1'}
          onClick={handleSubmit}
          className="border rounded-md px-4 "
        >
          Start
        </button>
        <button
          type="submit"
          value={'0'}
          onClick={handleSubmit}
          className="border rounded-md px-4 "
        >
          Stop
        </button>
      </form>
      <div>
        <button
          type="text"
          value={4003}
          className="border w-32 h-32 rounded-full"
          onClick={handleHum}
        >
         Get Humidity
        </button>
        <p className="text-center mt-3 text-lg">Humidity: { hum}</p>
      </div>
    </main>
  );
}
