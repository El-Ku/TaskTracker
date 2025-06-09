### Create Lightsail Instance

- Create a instance in AWS Lightsail(I will shortform of LS from here on).
- Click on Networking tab in the instance's settings and attach/create static ip to the instance.

### Update the DNS settings

- Go to namecheap and update the dns records with this static ip address as the `value` and sub domain as the Host. For example: @, www, www.tasktracker.app, www.tt-api.app etc..
- Go to https://dnschecker.org/ and verify that the dns records have been properly propogated.

### Connect using SSH

- In LS, in connect tab, click on `Connect using SSH`.
- Type the command `cat bitnami_application_password` in the console window which opens up.
- The application password will be printed. This command wont work after 24 hours of instance creation. So make sure to copy it now.

### SSL certificate generation:

- Run the following command in instance terminal: `sudo /opt/bitnami/bncert-tool`
- Follow the prompts.
  - Add subdomains seperated by a space. Their 'www' counterparts neednt be typed out.
  - say `yes` to http to https redirection
  - say `yes` to non-www to www redirection and `no` to vice versa.
- Once its completed the ssl certificate and key will be avaialable in the `/opt/bitnami/apache/conf` folder.

### Setting up Filezilla

Setup filezilla so that we can copy files to this LS instance easily.

- In the connect tab, click on `Download default key` to download the SSH key.
- Open filezilla, open site manager. Add a new site. Settings used are:
  - protocol: SFTP
  - host is static ip address.
  - logon type is keyfile.
  - user is "bitnami".
  - select the downloaded key file from the previous step.
- click "connect".

### Transfer project files into the instance:

Single command for manual copying:

```bash
cd /home/bitnami/ && mkdir ElkuFiles && cd ElkuFiles && mkdir TaskTracker && cd TaskTracker && mkdir server && mkdir client
# After copy the files:
cd server && npm install && cd ../client && npm install && npm run build
```

OR If pulling from Git(Single command)

```bash
cd /home/bitnami/ && mkdir ElkuFiles && cd ElkuFiles && git clone https://github.com/El-Ku/TaskTracker.git -b feat/assign-tasks && cd TaskTracker/server && npm install && cd ../client && npm install && npm run build
```

### Creating client(frontend) folder inside Apache folder

Single command:

```bash
cd /opt/bitnami/apache/htdocs && mkdir ElkuClients && cd ElkuClients && mkdir TaskTracker && cd TaskTracker && mv /home/bitnami/ElkuFiles/TaskTracker/client/dist/* .
```

### Create vhost file for Apache:

Create a vhost.conf file in the `/opt/bitnami/apache/conf/vhosts` folder and copy the below content to it:

```js
<VirtualHost *:443>
    ServerName www.elku.xyz
    DocumentRoot "/opt/bitnami/apache/htdocs/"

    SSLEngine on
    SSLCertificateFile "/opt/bitnami/apache/conf/elku.xyz.crt"
    SSLCertificateKeyFile "/opt/bitnami/apache/conf/elku.xyz.key"

    <Directory "/opt/bitnami/apache/htdocs/">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    Alias /tasktracker/ "/opt/bitnami/apache/htdocs/ElkuClients/TaskTracker/"
    <Directory "/opt/bitnami/apache/htdocs/ElkuClients/TaskTracker/">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy for backend API
    ProxyPass /tasktracker/api http://localhost:10000/tasktracker/api
    ProxyPassReverse /tasktracker/api http://localhost:10000/tasktracker/api
</VirtualHost>
```

- Now restart Apache server with this command: `sudo /opt/bitnami/ctlscript.sh restart apache`

### Set up htaccess file for SPA's:

- Create .htaccess file: ` touch /opt/bitnami/apache/htdocs/.htaccess` and copy the below contents into it:

```js
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /tasktracker/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /tasktracker/index.html [L]
</IfModule>
```

- Open this file: `/opt/bitnami/apache/conf/httpd.conf` and find this line: `<Directory "/opt/bitnami/apache/htdocs">`.
  - CHANGE: `AllowOverride None` TO: `AllowOverride All`

### Setting up MongoDB:

- Before starting server we need to set up mongodb.
- Run this command: `mongosh admin --username root -p <PASSWORD>`
- Create a database: `use TaskTracker`
- Create a colection inside it: `db.createCollection("Tasks")`
- Set MONGO_URI in pm2.config.cjs file in server folder as `mongodb://root:<PASSWORD>@localhost:27017/TaskTracker?authSource=admin`
  - Use this if there is a special character error with the password: https://www.urlencoder.org/

### Connecting MongoDB instance from our local MongoDB compass GUI.

- Create a SSH tunnel so that mongodb compass running on our computer can connect to this mongodb on instance.
- Change permission of the previously downloaded ssh key file: `chmod 400 DEV/FullStackDev/LightsailDefaultKey-ap-south-1.pem`
- Create the SSH tunnel: `ssh -i DEV/FullStackDev/LightsailDefaultKey-ap-south-1.pem -N -f -L 8000:127.0.0.1:27017 bitnami@13.204.38.212`
- Open MongoDB Compass on our local system. Create a new connection.
- Enter the following connection string `mongodb://root:<PASSWORD>@localhost:8000/`

Note that after a computer restart, if you want to use Compass on the lightsail database, you would have to recreate the SSH tunnel using the above command beginning with `ssh...`

### Install pm2 and start server

- Install pm2: `sudo npm install pm2@latest -g`
- Prepare `pm2.config.cjs` file this way:

```js
module.exports = {
  apps: [
    {
      name: "Task tracker",
      script: "./server.js",
      env: {
        PORT: 10000,
        MONGO_URI:
          "mongodb://root:<PASSWORD>@127.0.0.1:27017/DB_NAME?authSource=admin",
        NODE_ENV: "production",
        JWT_SECRET: "your secret key",
        EMAIL_PASSWORD: "gmail app password",
        EMAIL_USER: "your gmail id",
      },
    },
  ],
};
```

- Start server: `cd /home/bitnami/ElkuFiles/TaskTracker/server/ && pm2 start pm2.config.cjs`
- Use `pm2 ls` to comfirm its up and running.
- In case of errors use `pm2 logs` to see the latest entries into the log file. Keep it on and you will also see more logs getting appending live as they come.
- Type `pm2 startup`. Copy and run the command which was just output to the screen.
- Start pm2 on the server service. And run `pm2 save`.
- Run `sudo reboot` and `pm2 ls` to make sure its working.
  (for some reason this restart doesnt seem to work when the system is reboot from the lightsail console)

### Incase the codes are modified:

Suppose client/server was directly modified over Filezilla, run the below command:

```bash
cd /home/bitnami/ElkuFiles/TaskTracker/client && npm install && npm run build && cd /opt/bitnami/apache/htdocs/ElkuClients/TaskTracker/ && rm -rf assets/ && rm index.html && mv /home/bitnami/ElkuFiles/TaskTracker/client/dist/* . && cd /home/bitnami/ElkuFiles/TaskTracker/server/ && npm install && pm2 restart pm2.config.cjs
```

Or if client/server was updated at github, run the below command:

```bash
cd /home/bitnami/ElkuFiles/ && rm -rf TaskTracker && git clone https://github.com/El-Ku/TaskTracker.git -b feat/assign-tasks && cd TaskTracker/server && npm install && cd ../client && npm install && npm run build && cd /opt/bitnami/apache/htdocs/ElkuClients/TaskTracker/ && rm -rf assets/ && rm index.html && mv /home/bitnami/ElkuFiles/TaskTracker/client/dist/* . && cd /home/bitnami/ElkuFiles/TaskTracker/server/ && pm2 restart pm2.config.cjs
```
