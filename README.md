# java-swagger-util

## docter
### usage

```bash
python docter.py "absolute-path-for-controller"

```

### Example

```python
# For windows, use dobule quote "<path>"
python docter.py -p "C:/project/~~~/controller/TestController.java"
```

```java
// TestController.java
@RestController
@RequestMapping("/test")
public class TestController implements TestControllerDocs {
    @GetMapping("1")
    public String hello(){
       return "hello";
    }
    @GetMapping("2")
    public String hel2lo(){
       return "hello";
    }
    @GetMapping("3")
    public String hel3lo(){
       return "hello";
    }
    @GetMapping("4")
    public String he54llo(){
       return "hello";
    }
}
```

and then, swagger doc for TestController will be auto-generate. (./docs/TestControllerDocs.java)

```java
@Tag(name = "TestController", description = "")
public interface TestControllerDocs {
    @Operation(summary = "", description = "")
    public String hello();

    @Operation(summary = "", description = "")
    public String hel2lo();

    @Operation(summary = "", description = "")
    public String hel3lo();

    @Operation(summary = "", description = "")
    public String he54llo();

}
```

- You have to import some packages..
- Implements Doc