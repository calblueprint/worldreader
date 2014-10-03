# example_spec.rb
class Bowling
  def initialize
    @score = 0
  end

  def hit(pins)
  	@score += pins
  end

  def score
    @score
  end
end

describe Bowling, "#score" do
  it "returns score of game" do
    bowling = Bowling.new
    20.times { bowling.hit(1) }
    expect(bowling.score).to eq(20)
    bowling.hit(20)
    expect(bowling.score).to eq(40)
  end
end
