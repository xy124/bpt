# if this is not running:
# openssl req -new -x509 -keyout localhost.pem -out localhost.pem -days 365 -nodes
# disable your firewall ;) (ufw disable...)

import http.server, ssl

server_address = ('', 4444)
print("hosting on:", server_address)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile='localhost.pem',
                               ssl_version=ssl.PROTOCOL_TLS)
httpd.serve_forever()
