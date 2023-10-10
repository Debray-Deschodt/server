if you have the error :
EADDRINUSE, Address already in use

you can list the process that listen this port with:
sudo lsof -i :3000

and then kill it with :
kill -9 //PID

where you replace //PID by the process ID.
