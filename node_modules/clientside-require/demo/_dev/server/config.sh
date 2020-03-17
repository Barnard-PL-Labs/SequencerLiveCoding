MODULE_NAME=clientside-require;

## create the .conf file and place it into the directory apache will search for
sudo rm /etc/apache2/sites-enabled/$MODULE_NAME.conf
sudo rm /etc/apache2/sites-available/$MODULE_NAME.conf
sudo ln -s `pwd`/apache.conf /etc/apache2/sites-available/$MODULE_NAME.conf &&
sudo ln -s /etc/apache2/sites-available/$MODULE_NAME.conf /etc/apache2/sites-enabled/$MODULE_NAME.conf
sudo service apache2 restart
