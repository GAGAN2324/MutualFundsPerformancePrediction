package com.gagan.mutualfunds.service;

import org.springframework.stereotype.Service;
import weka.classifiers.functions.LinearRegression;
import weka.classifiers.trees.RandomForest;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import java.util.ArrayList;
import java.util.List;

/**
 * Produces genuinely distinct multi-step NAV forecasts for three models:
 *  - LINEAR : Weka LinearRegression trained on (timeIndex -> NAV)
 *  - RF     : Weka RandomForest trained on (timeIndex -> NAV)
 *  - ARIMA  : lightweight drift-based approximation (last value + trend),
 *             since Weka has no native ARIMA implementation.
 *
 * All three are trained on the same historical NAV series and used to
 * forecast `horizon` future steps (e.g. months) ahead.
 */
@Service
public class TimeSeriesModelService {

    public static class ForecastResult {
        public double[] linear;
        public double[] rf;
        public double[] arima;
    }

    public ForecastResult forecast(List<Double> series, int horizon) throws Exception {
        ForecastResult result = new ForecastResult();

        Instances dataset = buildDataset(series);

        LinearRegression lr = new LinearRegression();
        lr.buildClassifier(dataset);

        RandomForest rf = new RandomForest();
        rf.buildClassifier(dataset);

        int n = series.size();

        double[] linearOut = new double[horizon];
        double[] rfOut = new double[horizon];
        double[] arimaOut = new double[horizon];

        // ARIMA-style drift: average of last few period-over-period changes
        double drift = computeDrift(series);
        double lastValue = series.get(n - 1);

        for (int step = 0; step < horizon; step++) {
            int futureIndex = n + step;

            Instance inst = new DenseInstance(2);
            inst.setValue(0, futureIndex);
            inst.setDataset(dataset);
            inst.setMissing(1);

            linearOut[step] = lr.classifyInstance(inst);
            rfOut[step] = rf.classifyInstance(inst);

            lastValue = lastValue + drift;
            arimaOut[step] = lastValue;
        }

        result.linear = linearOut;
        result.rf = rfOut;
        result.arima = arimaOut;
        return result;
    }

    private Instances buildDataset(List<Double> series) {
        ArrayList<Attribute> attrs = new ArrayList<>();
        attrs.add(new Attribute("t"));
        attrs.add(new Attribute("nav"));

        Instances dataset = new Instances("navSeries", attrs, series.size());
        dataset.setClassIndex(1);

        for (int i = 0; i < series.size(); i++) {
            double[] values = new double[]{i, series.get(i)};
            dataset.add(new DenseInstance(1.0, values));
        }

        return dataset;
    }

    /** Average of the last N period-over-period changes, used as ARIMA drift term. */
    private double computeDrift(List<Double> series) {
        int window = Math.min(6, series.size() - 1);
        if (window <= 0) return 0.0;

        double sum = 0;
        for (int i = series.size() - window; i < series.size(); i++) {
            sum += series.get(i) - series.get(i - 1);
        }
        return sum / window;
    }
}
