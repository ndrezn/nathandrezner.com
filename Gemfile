source "https://rubygems.org"
# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem "jekyll", "~> 4.2.0"
gem "webrick", "~> 1.7"
gem "ffi", "~> 1.15.5"

# Ruby 3.4+ moved these out of the default gems; Jekyll 4.2 still requires them
gem "csv"
gem "logger"
gem "base64"
gem "bigdecimal"

# liquid 4.0.3 calls String#tainted?, removed in Ruby 3.2; 4.0.4 fixes it
gem "liquid", "~> 4.0.4"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]


