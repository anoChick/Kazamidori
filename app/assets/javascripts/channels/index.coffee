


((global, $) ->
  @App ||= {}
  $ ()->
    App.roomId = location.hash||'default'
    App.identifier = Math.random().toString(36).slice(-8)
    App.cable = ActionCable.createConsumer()
    App.room = App.cable.subscriptions.create "RoomChannel",
      collection: -> $("[data-channel='room']")
      connected: ->
        console.log 'connected'
      disconnected: ->
        console.log 'disconnected'
      received: (data) ->
        return if App.identifier == data.user_id
        return unless App.roomId == data.room_id
        App.ael=getVector(window.myPosition,data.position)
        document.getElementById('ael').innerHTML = JSON.stringify(App.ael)
      forward: ->
        App.room.perform 'forward', {
          position: window.myPosition
          room_id: App.roomId,
          user_id: App.identifier
        }
    $('#test-button').on 'click', ()->
      location.hash = Math.random().toString(36).slice(-8)
      App.roomId = location.hash||'default'
    setInterval App.room.forward,1000
    createArrow()
) this, jQuery
