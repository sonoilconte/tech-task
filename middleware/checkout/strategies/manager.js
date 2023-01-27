let strategy = null;

const strategyManager = {
  setStrategy (newStrategy) {
    strategy = newStrategy;
  },
  execute (params) {
    return strategy.execute(params);
  }
};

export default strategyManager;
