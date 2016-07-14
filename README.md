# log-service

Their are two key issues with the json-file docker log driver
- rotation
- service orientation

This service attempts to solve both by
- capturing the logs with node and service metadata
- storing the data in an event stream (to be replaced by kafka)
- returning the logs based on service