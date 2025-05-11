import os from 'os';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const interfac = interfaces[interfaceName];
    for (const config of interfac) {
      
      if (config.family === 'IPv4' && !config.internal) {
        console.log(config.address);
        return config.address;
      }
    }
  }
  return '127.0.0.1';
}

export default getLocalIp;