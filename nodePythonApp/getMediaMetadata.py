import subprocess
import sys

subprocess.check_output(['instagram-scraper', 
                            '-f', './' + sys.argv[1] +'/followings.txt',
                            '--media-types', 'none', 
                            '--media-metadata',
                            '--maximum', '20',
                            '--destination', './' + sys.argv[1] + '/',
                            '--latest'])