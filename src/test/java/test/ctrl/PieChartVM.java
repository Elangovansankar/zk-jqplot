package test.ctrl;

import java.util.List;
import java.util.Map;

import org.zkoss.bind.annotation.BindingParam;
import org.zkoss.bind.annotation.Command;
import org.zkoss.bind.annotation.AfterCompose;
import org.zkoss.bind.annotation.GlobalCommand;
import org.zkoss.bind.annotation.NotifyChange;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zul.PieModel;
import org.zkoss.zul.SimplePieModel;

public class PieChartVM {
	
	PieModel model;
	
	double value1 = 22.1D;
	double value2 = 10.2D;
	double value3 = 40.4D;
	double value4 = 28.2D;	
	
	@AfterCompose
	public void init() {
		model = new SimplePieModel();
		model.setValue("C/C++", new Double(21.2));
		model.setValue("VB", new Double(10.2));
		model.setValue("Java", new Double(40.4));
		model.setValue("PHP", new Double(28.2));		
	}
	
    public PieModel getModel() {
        return model;
    }
    
	// ZK EE Only!!
	@Command
    public void dataOnClick(@BindingParam("event") Event event) {
//		Map map = (Map) event.getData();
//		List data = (List) map.get("data");
//		if (data != null)
//			Clients.alert("" + data.get(0) + ":" + data.get(1));    	
    }
    
    @GlobalCommand("dataChanged") 
    @NotifyChange("model")
    public void onDataChanged(
            @BindingParam("category")String category,
            @BindingParam("num") Number num){
        model.setValue(category, num);
    }

	public double getValue1() {
		return value1;
	}

	public void setValue1(double value1) {
		this.value1 = value1;
	}

	public double getValue2() {
		return value2;
	}

	public void setValue2(double value2) {
		this.value2 = value2;
	}

	public double getValue3() {
		return value3;
	}

	public void setValue3(double value3) {
		this.value3 = value3;
	}

	public double getValue4() {
		return value4;
	}

	public void setValue4(double value4) {
		this.value4 = value4;
	}

}
