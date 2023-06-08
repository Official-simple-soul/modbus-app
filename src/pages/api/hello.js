
import ModbusRTU from 'modbus-serial';

const host = '192.168.43.184';
const port = 502;

export default async function handler(req, res) {
  const { reg, val } = req.body.data;
  const client = new ModbusRTU();
  try {
    await client.connectTCP(host, { port });

    switch (Number(reg)) {
      case 4003:
        try {
          const data = await client.readInputRegisters(Number(reg),1);
          res.status(200).json({ value: data.data[0] });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .send(`Error reading Modbus register(Humidity): ${err.message}`);
        } finally {
          client.close();
        }
        break;
      case 4001:
        try {
          await client.writeCoil(reg, Number(val)).then(() => {
            res.status(200).send(`Successfully wrote to Buzzer Coil`);
          });
        } catch (err) {
          console.log(err);
          res.status(500).send(`Could not write to Buzzer Coil`);
        } finally {
          client.close();
        }
        break;
      default:
        res.status(500).send(`Sorry!, please provide a valid input`);
        client.close();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error connecting to Modbus server: ${err.message}`);
  }
}
