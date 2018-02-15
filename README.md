Instalação do Ambiente de Desenvolvimento
=========================================

* Procedimento testado nos seguintes SO's:

  * `Ubuntu 16.04 64bits <https://github.com/interlegis/agenda-evento>`_;

* Para esta instalação foi utilizado o usuário de sistema Agenda 


Atualizar o sistema::
----------------------

 ::

    sudo apt-get update

    sudo apt-get upgrade
    
    
Instalar a docker::
----------------------------------------------------------------------------------------

:: 

    sudo apt-get remove docker docker-engine docker.io
    
    sudo apt-get update
    
    sudo apt-get install \
      apt-transport-https \
      ca-certificates \
      curl \
      software-properties-common
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
    sudo apt-key fingerprint 0EBFCD88
    
    sudo add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) \
      stable"
     
Instalar a docker-compose::
----------------------------------------------------------------------------------------

:: 

    sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o     /usr/local/bin/docker-compose
    
    sudo chmod +x /usr/local/bin/docker-compose
    
    docker-compose --version
    
    
Instalar o virtualenv usando python 2 para o projeto.
-----------------------------------------------------

* Para usar `virtualenvwrapper <https://virtualenvwrapper.readthedocs.org/en/latest/install.html#basic-installation>`_, instale com::

      sudo pip3 install virtualenvwrapper
    
    
    
