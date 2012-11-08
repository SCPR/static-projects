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

# Noop some tasks
namespace :deploy do
  task :start do end
  task :stop do end
  task :restart do end
  task :migrate do end
  
  # Don't really want these files accessible at the web
  task :remove_repo_files do
    run "cd #{latest_release} && rm -rf Capfile config"
    run "cd #{latest_release} && find . -name 'README.*' -print0 | xargs -0 rm"
  end
end

after "deploy:update", "deploy:remove_repo_files"
after "deploy:restart", "deploy:cleanup"
