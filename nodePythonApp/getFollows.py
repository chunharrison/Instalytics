import subprocess
import sys

subprocess.check_output(['instagram-scraper', 
                            '--followings-input',
                            '--login-user', sys.argv[1], '--login-pass', sys.argv[2],
                            '--followings-output', 'followings.txt',
                            '--destination', './' + sys.argv[1] + '/',
                            '--media-types', 'none'])
