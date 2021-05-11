from fabric.api import *
import os

env.hosts = ['nate-is-loved-by.firebelly.co']
env.user = 'firebelly'
env.remotepath = '/home/firebelly/apps/fwb'
env.git_branch = 'main'
env.warn_only = True
env.forward_agent = True

def deploy():
  update()
  if assets != 'n':
    local('rm -rf dist')
    local('yarn build:production')
    run('mkdir -p ' + env.remotepath + '/dist')
    put('dist', env.remotepath + '/')

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))
