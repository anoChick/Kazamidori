# Be sure to restart your server when you modify this file. Action Cable runs in an EventMachine loop that does not support auto reloading.
class RoomChannel < ApplicationCable::Channel
  def subscribed
    @room_id = 'default'
    stream_from "room:#{@room_id}"
  end

  def unsubscribed
  end

  def join(data)
    @room_id = data['room_id']||'default'
    stop_all_streams
    stream_from "room:#{@room_id}"
  end
  
  def forward(data)
    ActionCable.server.broadcast "room:#{@room_id}", data
  end
end
