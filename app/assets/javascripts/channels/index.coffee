


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
        App.room.join()
      disconnected: ->
        console.log 'disconnected'
      received: (data) ->
        return if App.identifier == data.user_id
        App.ael=getVector(window.myPosition,data.position)
        document.getElementById('ael').innerHTML = JSON.stringify(App.ael)
      forward: ->
        App.room.perform 'forward', {
          position: window.myPosition
          user_id: App.identifier
        }
      join: ->
        App.room.perform 'join', {
          room_id: App.roomId,
        }
    $('#test-button').on 'click', ()->
      location.hash = Math.random().toString(36).slice(-8)
      location.reload()
    setInterval App.room.forward,1000
    createArrow()
) this, jQuery
