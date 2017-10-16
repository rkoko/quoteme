class Quote < ApplicationRecord
  def next_id
    #self.class.where('id > ?', self.id).order(id: :asc).first.id
    # self.class.where('id > ?', self.id).pluck(:id).first
    self.class.where('id > ?', self.id).ids.first
  end

  def previous_id
    # self.class.where('id < ?', self.id).order(id: :desc).first.id --> gives an undefined method instead of nil
    # self.class.where('id < ?', self.id).pluck(:id).last
    self.class.where('id < ?', self.id).ids.last
  end
end
