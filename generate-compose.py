#!/usr/bin/env python

"""docker-compose.yml generator.
   It takes existing docker-compose.yml,
   replaces "build:" instructions with the "image:" instructions,
   preserves current binds - will read them from the running containers

Usage:
  generate-compose.py [ --debug ] --file=file --web-image=web_image --nginx-image=nginx_image --output=file
  generate-compose.py (-h | --help)

Options:
  --file=file                  Path to the base docker-compose.yml file
  --web-image=web_image        Web image name
  --nginx-image=nginx_name     Nginx image name
  --output=file                New compose file name
  -h --help                    Show this screen
  -d --debug                   Print debug info


"""
from docopt import docopt
from subprocess import check_output
import logging
import yaml
import re

def main():
  arguments = docopt(__doc__)

  if arguments['--debug']:
    logging.basicConfig(level=logging.DEBUG)

  logging.debug("Arguments: {}".format(arguments))

  with open(arguments['--file'], 'r') as f:
    doc = yaml.load(f)

  logging.debug("Provided docker compose file: {}".format(doc))

  # Update services
  services = {"nginx": "--nginx-image", "web": "--web-image"}
  for service_name, serive_flag in services.items():
    logging.info("Update definition for {}. Relace build with image...".format(service_name))
    logging.debug("Before: {}".format(doc["services"][service_name]))
    del doc["services"][service_name]["build"]
    doc["services"][service_name]["image"] = arguments[serive_flag]

  with open(arguments["--output"], 'w') as outfile:
    outfile.write( yaml.dump(doc, default_flow_style=False) )

if __name__ == "__main__":
    main()
