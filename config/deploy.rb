set :application, "static"
set :scm, :git
set :repository,  "git@github.com:SCPR/static-projects.git"
set :scm_verbose, true
set :deploy_via, :remote_cache
set :deploy_to, "/web/archive/static"

set :user, "archive"
set :use_sudo, false
set :group_writable, false

# --------------
# Variables
set :branch, "master"

# --------------
# Roles
role :app, "media.scpr.org"
role :web, "media.scpr.org"

# Setup staging
task :staging do
  roles.clear
  role :app, "scprdev.org"
  role :web, "scprdev.org"
end

# Noop restart things
namespace :deploy do
  task :start do end
  task :stop do end
  task :restart do end
end

after "deploy:restart", "deploy:cleanup"
