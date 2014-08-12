require 'spec_helper'

describe 'redis::instance', :type => 'define' do
  let(:title) { 'redis-instance' }

  context "On Debian systems with no password parameter" do

    let :facts do
      {
        :osfamily  => 'Debian'
      }
    end # let

    let :params do
      {
        :redis_password => false
      }
    end # let

    it do
      should_not contain_file('redis_port_6379.conf').with_content(/^requirepass/)
    end # it
  end # context

  context "On Debian systems with password parameter" do

    let :facts do
      {
        :osfamily  => 'Debian'
      }
    end # let

    let :params do
      {
        :redis_port     => '6900',
        :redis_password => 'ThisIsAReallyBigSecret'
      }
    end # let

    it do
      should contain_file('redis_port_6900.conf').with_content(/^requirepass ThisIsAReallyBigSecret/)
      should contain_file('redis-init-6900').with_content(/^CLIEXEC="[\w\/]+redis-cli -h \$REDIS_BIND_ADDRESS -p \$REDIS_PORT -a ThisIsAReallyBigSecret/)
    end # it
  end # context

  context "With a non-default port parameter" do
    let :params do
      {
        :redis_port => '6900'
      }
    end # let

    it do
      should contain_file('redis_port_6900.conf').with_content(/^port 6900$/)
      should contain_file('redis_port_6900.conf').with_content(/^pidfile \/var\/run\/redis_6900\.pid$/)
      should contain_file('redis_port_6900.conf').with_content(/^logfile \/var\/log\/redis_6900\.log$/)
      should contain_file('redis_port_6900.conf').with_content(/^dir \/var\/lib\/redis\/6900$/)
      should contain_file('redis-init-6900').with_content(/^REDIS_PORT="6900"$/)
    end # it
  end # context

  context "With a non default bind address" do
    let :params do
      {
        :redis_port => '6900',
        :redis_bind_address => '10.1.2.3'
      }
    end # let

    it do
      should contain_file('redis_port_6900.conf').with_content(/^bind 10\.1\.2\.3$/)
      should contain_file('redis-init-6900').with_content(/^REDIS_BIND_ADDRESS="10.1.2.3"$/)
    end # it
  end # context
end # describe
