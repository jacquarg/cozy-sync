jsDAV = require "jsDAV"

jsDAV.debugMode = not not process.env.DEBUG

# Auth
cozy_Auth_Backend = require './backends/auth'

# Permissions
jsDAVACL_PrincipalCollection = require "jsDAV/lib/DAVACL/principalCollection"
cozy_PrincipalBackend = require './backends/principal'
principalBackend = new cozy_PrincipalBackend
nodePrincipalCollection = jsDAVACL_PrincipalCollection.new(principalBackend)

# Contacts
jsCardDAV_AddressBookRoot = require "jsDAV/lib/CardDAV/addressBookRoot"
cozy_CardBackend = require './backends/carddav'
carddavBackend = new cozy_CardBackend require './models/contact'
nodeCardDAV = jsCardDAV_AddressBookRoot.new(principalBackend, carddavBackend)

# Calendar
Event = require './models/event'
User = require './models/user'
jsCalDAV_CalendarRoot        = require "jsDAV/lib/CalDAV/calendarRoot"
cozy_CalBackend = require './backends/caldav'
caldavBackend  = new cozy_CalBackend Event, User
nodeCalDAV = jsCalDAV_CalendarRoot.new(principalBackend, caldavBackend)


# Init DAV Server
module.exports = jsDAV.mount
    server: true
    standalone: false

    realm: 'jsDAV'
    mount: '/public/sync/'

    authBackend: cozy_Auth_Backend.new()
    plugins: [
        require "jsDAV/lib/DAV/plugins/auth"
        require "jsDAV/lib/CardDAV/plugin"
        require "jsDAV/lib/CalDAV/plugin"
        require "jsDAV/lib/DAVACL/plugin"
    ]

    node: [nodePrincipalCollection, nodeCardDAV, nodeCalDAV]
