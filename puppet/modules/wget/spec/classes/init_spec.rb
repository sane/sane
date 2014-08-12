require 'spec_helper'

describe 'wget' do

  context 'running on OS X' do
    let(:facts) { {:operatingsystem => 'Darwin'} }

    it { should_not contain_package('wget') }
  end

  context 'running on CentOS' do
    let(:facts) { {:operatingsystem => 'CentOS'} }

    it { should contain_package('wget') }
  end

  context 'no version specified' do
    it { should contain_package('wget').with_ensure('installed') }
  end

  context 'version is 1.2.3' do
    let(:params) { {:version => '1.2.3'} }

    it { should contain_package('wget').with_ensure('1.2.3') }
  end

  describe 'wget::fetch' do
    it { should contain_exec('wget-test').with_command('wget --no-verbose --output-document=/tmp/dest http://localhost/source') }
  end

  describe 'wget::authfetch' do
    it { should contain_exec('wget-authtest').with({
      'command'     => 'wget --no-verbose --user=myuser --output-document=/tmp/dest http://localhost/source',
      'environment' => 'WGETRC=/tmp/wgetrc-authtest'
      })
    }
    it { should contain_file('/tmp/wgetrc-authtest').with_content('password=mypassword') }
  end
end
