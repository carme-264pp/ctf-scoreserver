require 'pp'
$LOAD_PATH << Dir::pwd

require 'config'

require 'tables'
require 'signup'
require 'login'
require 'ranking'
require 'announcements'

require 'admin'

require 'scoreserver'

run Sinatra::Application

